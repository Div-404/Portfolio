import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cell {
  row: number;
  col: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
}

type MazeState = 'idle' | 'generating' | 'generated' | 'solving' | 'solved' | 'playing';

@Component({
  selector: 'app-maze',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="maze-container">
      <!-- Title & Controls HUD -->
      <div class="maze-hud-window">
        <div class="hud-header">
          <span class="hud-logo">⚡ MAZE_PROTOCOL_v1.0.4</span>
          <span class="hud-status" [class.pulse]="state === 'generating' || state === 'solving'">
            STATUS: {{ state.toUpperCase() }}
          </span>
        </div>

        <div class="hud-controls">
          <!-- Size selection -->
          <div class="control-row">
            <span class="control-label">GRID SIZE:</span>
            <div class="size-buttons">
              <button 
                *ngFor="let size of [5, 10, 15, 20]" 
                [class.active]="rows === size" 
                [disabled]="state === 'generating' || state === 'solving'"
                (click)="setSize(size)">
                {{ size }}x{{ size }}
              </button>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="action-buttons">
            <button 
              class="cyber-btn gen-btn" 
              [disabled]="state === 'generating' || state === 'solving'" 
              (click)="generateMaze()">
              GENERATE
            </button>
            <button 
              class="cyber-btn solve-btn" 
              [disabled]="state !== 'generated'" 
              (click)="solveMaze()">
              AUTO-SOLVE
            </button>
            <button 
              class="cyber-btn play-btn" 
              [disabled]="state !== 'generated' && state !== 'solved'" 
              (click)="startManualPlay()">
              PLAY MANUAL
            </button>
            <button 
              class="cyber-btn reset-btn" 
              (click)="resetMaze()">
              RESET
            </button>
          </div>
        </div>

        <!-- Telemetry Stats -->
        <div class="hud-stats">
          <div class="stat-item">GRID: <span class="highlight">{{ rows }}x{{ cols }}</span></div>
          <div class="stat-item">STEPS: <span class="highlight">{{ steps || playerSteps }}</span></div>
          <div class="stat-item">PATH LENGTH: <span class="highlight">{{ solutionPath.length || '-' }}</span></div>
          <div class="stat-item">TIMER: <span class="highlight">{{ formatTime(timerSeconds) }}</span></div>
        </div>

        <!-- Instructions Overview -->
        <div class="hud-instructions">
          🎮 <span class="highlight">RULES:</span> Use <span class="highlight">WASD</span> or <span class="highlight">Arrow Keys</span> to navigate the pink player block from <span class="highlight">Start (S)</span> to <span class="highlight">End (E)</span>. Or click <span class="highlight">GENERATE</span> / <span class="highlight">AUTO-SOLVE</span> to watch algorithms build and solve the firewall maze!
        </div>
      </div>

      <!-- Canvas Box -->
      <div class="canvas-wrapper">
        <canvas #mazeCanvas></canvas>

        <!-- You Escaped Win Modal -->
        <div class="win-modal" *ngIf="state === 'solved' && playerSteps > 0">
          <div class="win-content">
            <h2 class="glitch-title">SECURITY ESCAPED</h2>
            <p>You successfully navigated Shivam's neural firewall buffer!</p>
            <div class="win-telemetry">
              <div>TIME: {{ formatTime(timerSeconds) }}</div>
              <div>STEPS TAKEN: {{ playerSteps }}</div>
            </div>
            <button class="cyber-btn exit-btn" (click)="exitToPortfolio()">
              DEPLOY & ENTER PORTFOLIO
            </button>
          </div>
        </div>
      </div>

      <!-- Exit Button Always Visible -->
      <button class="skip-btn" (click)="exitToPortfolio()">
        SKIP TO PORTFOLIO
      </button>
    </div>
  `,
  styles: [`
    .maze-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      background: #030205;
      position: absolute;
      inset: 0;
      z-index: 150;
      font-family: 'JetBrains Mono', monospace;
      color: #ffffff;
      padding: 1.5rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    /* HUD Styling */
    .maze-hud-window {
      width: 100%;
      max-width: 600px;
      background: rgba(10, 8, 16, 0.85);
      border: 1px solid rgba(0, 245, 170, 0.25);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
      margin-bottom: 1.5rem;
      padding: 1rem;
      box-sizing: border-box;
    }

    .hud-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed rgba(0, 245, 170, 0.15);
      padding-bottom: 0.5rem;
      margin-bottom: 0.8rem;
    }

    .hud-logo {
      font-weight: bold;
      color: #00f5aa;
      text-shadow: 0 0 10px rgba(0, 245, 170, 0.4);
      font-size: 0.85rem;
    }

    .hud-status {
      font-size: 0.72rem;
      color: #ff9f1c;
    }

    .hud-status.pulse {
      animation: statusPulse 1s infinite alternate;
    }

    @keyframes statusPulse {
      0% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    /* Grid Selection & Buttons */
    .hud-controls {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
    }

    .control-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
    }

    .control-label {
      color: #86868b;
    }

    .size-buttons {
      display: flex;
      gap: 0.4rem;
    }

    .size-buttons button {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #86868b;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .size-buttons button:hover:not(:disabled) {
      border-color: #00f5aa;
      color: #00f5aa;
    }

    .size-buttons button.active {
      background: rgba(0, 245, 170, 0.1);
      border-color: #00f5aa;
      color: #00f5aa;
      box-shadow: 0 0 10px rgba(0, 245, 170, 0.2);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .cyber-btn {
      flex: 1;
      min-width: 100px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .cyber-btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .cyber-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .cyber-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .gen-btn {
      border-color: #00f5aa;
      color: #00f5aa;
      box-shadow: 0 0 10px rgba(0, 245, 170, 0.1);
    }
    .gen-btn:hover:not(:disabled) {
      background: #00f5aa;
      color: #000000;
      box-shadow: 0 0 20px #00f5aa;
    }

    .solve-btn {
      border-color: #6366f1;
      color: #6366f1;
    }
    .solve-btn:hover:not(:disabled) {
      background: #6366f1;
      color: #ffffff;
      box-shadow: 0 0 20px #6366f1;
    }

    .play-btn {
      border-color: #ec4899;
      color: #ec4899;
    }
    .play-btn:hover:not(:disabled) {
      background: #ec4899;
      color: #ffffff;
      box-shadow: 0 0 20px #ec4899;
    }

    .reset-btn {
      border-color: rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.6);
    }
    .reset-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    /* Telemetry HUD stats */
    .hud-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.68rem;
      color: #86868b;
      border-top: 1px dashed rgba(255, 255, 255, 0.08);
      padding-top: 0.6rem;
    }

    .stat-item .highlight {
      color: #ffffff;
      font-weight: bold;
    }

    .hud-instructions {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.65);
      background: rgba(0, 245, 170, 0.05);
      border: 1px dashed rgba(0, 245, 170, 0.25);
      padding: 0.55rem;
      border-radius: 6px;
      margin-top: 0.8rem;
      line-height: 1.45;
      box-sizing: border-box;
    }

    /* Canvas Frame */
    .canvas-wrapper {
      position: relative;
      background: #0a0810;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
      padding: 10px;
    }

    canvas {
      display: block;
      max-width: 90vw;
      max-height: 52vh;
    }

    /* Win screen Modal */
    .win-modal {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(3, 2, 5, 0.95);
      border-radius: 12px;
      z-index: 160;
      animation: modalFadeIn 0.3s ease-out forwards;
    }

    @keyframes modalFadeIn {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1.0); }
    }

    .win-content {
      text-align: center;
      background: rgba(10, 8, 16, 0.95);
      border: 1px solid #ec4899;
      box-shadow: 0 0 30px rgba(236, 72, 153, 0.3);
      border-radius: 12px;
      padding: 2rem;
      max-width: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
    }

    .glitch-title {
      font-size: 1.3rem;
      font-weight: 900;
      color: #ec4899;
      text-shadow: 0 0 10px #ec4899;
      letter-spacing: 0.1em;
      margin: 0;
    }

    .win-content p {
      font-size: 0.78rem;
      color: #86868b;
      line-height: 1.5;
      margin: 0;
    }

    .win-telemetry {
      font-size: 0.85rem;
      font-weight: bold;
      color: #00f5aa;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .exit-btn {
      border-color: #ec4899;
      color: #ec4899;
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.2);
    }
    .exit-btn:hover {
      background: #ec4899;
      color: #ffffff;
      box-shadow: 0 0 30px #ec4899;
    }

    /* Bypass bottom CTA */
    .skip-btn {
      margin-top: 1.5rem;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.4);
      font-family: inherit;
      font-size: 0.72rem;
      padding: 6px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      outline: none;
    }

    .skip-btn:hover {
      border-color: #ec4899;
      color: #ec4899;
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.15);
    }
  `]
})
export class MazeComponent implements OnInit, OnDestroy {
  @ViewChild('mazeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() exit = new EventEmitter<void>();

  state: MazeState = 'idle';
  rows = 10;
  cols = 10;
  grid: Grid = [];
  steps = 0;
  playerSteps = 0;
  solutionPath: Cell[] = [];
  timerSeconds = 0;

  // Player coords in playing state
  player = { row: 0, col: 0 };

  private ctx!: CanvasRenderingContext2D | null;
  private timerInterval: any;
  
  // Animation delay values
  private generationSpeed = 10;
  private solvingSpeed = 25;

  // Web Audio Context for native synthesizer blips
  private audioCtx: AudioContext | null = null;

  ngOnInit() {
    this.setupCanvas();
    this.resetGrid();
    this.draw();
  }

  ngOnDestroy() {
    this.stopTimer();
    this.state = 'idle';
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    // Set a square bounding dimensions
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.52, 480);
    canvas.width = size;
    canvas.height = size;
    this.ctx = canvas.getContext('2d');
  }

  @HostListener('window:resize')
  onResize() {
    this.setupCanvas();
    this.draw();
  }

  setSize(size: number) {
    this.rows = size;
    this.cols = size;
    this.resetMaze();
  }

  resetMaze() {
    this.stopTimer();
    this.state = 'idle';
    this.steps = 0;
    this.playerSteps = 0;
    this.solutionPath = [];
    this.timerSeconds = 0;
    this.resetGrid();
    this.draw();
    this.playAudioBlip('click');
  }

  resetGrid() {
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({
          row: r,
          col: c,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false
        });
      }
      this.grid.push(row);
    }
  }

  // Generation: DFS Recursive Backtracking
  async generateMaze() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.state = 'generating';
    this.steps = 0;
    this.playerSteps = 0;
    this.solutionPath = [];
    this.timerSeconds = 0;
    this.resetGrid();
    this.playAudioBlip('click');

    const stack: Cell[] = [];
    let current = this.grid[0][0];
    current.visited = true;
    stack.push(current);

    while (stack.length > 0) {
      if (this.state !== 'generating') return;

      const unvisited = this.getUnvisitedNeighbors(current);
      if (unvisited.length > 0) {
        const next = unvisited[Math.floor(Math.random() * unvisited.length)];
        next.visited = true;
        
        stack.push(current);
        this.removeWalls(current, next);
        current = next;
        this.steps++;

        this.draw();
        await this.delay(this.generationSpeed);
      } else {
        current = stack.pop()!;
      }
    }

    // Reset visited flag for solver algorithm
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c].visited = false;
      }
    }

    this.state = 'generated';
    this.playAudioBlip('win');
    this.draw();
  }

  // Solver: BFS
  async solveMaze() {
    if (this.state !== 'generated' && this.state !== 'solved') return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.state = 'solving';
    this.steps = 0;
    this.solutionPath = [];

    // Clear visited state from playing / previous solves
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c].visited = false;
      }
    }

    const queue: Cell[] = [];
    const parentMap = new Map<string, Cell>();
    const start = this.grid[0][0];
    const end = this.grid[this.rows - 1][this.cols - 1];

    start.visited = true;
    queue.push(start);

    let solved = false;

    while (queue.length > 0) {
      if (this.state !== 'solving') return;

      const current = queue.shift()!;
      this.steps++;

      if (current === end) {
        solved = true;
        break;
      }

      const neighbors = this.getReachableNeighbors(current);
      for (const n of neighbors) {
        if (!n.visited) {
          n.visited = true;
          parentMap.set(`${n.row},${n.col}`, current);
          queue.push(n);

          this.draw();
          await this.delay(this.solvingSpeed);
        }
      }
    }

    if (solved) {
      this.solutionPath = [];
      let pathCell: Cell | undefined = end;
      while (pathCell) {
        this.solutionPath.unshift(pathCell);
        pathCell = parentMap.get(`${pathCell.row},${pathCell.col}`);
      }
      this.state = 'solved';
      this.playAudioBlip('win');
    } else {
      this.state = 'generated';
    }
    this.draw();
  }

  // Play Mode
  startManualPlay() {
    if (this.state !== 'generated' && this.state !== 'solved') return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.state = 'playing';
    this.playerSteps = 0;
    this.steps = 0;
    this.solutionPath = [];
    this.timerSeconds = 0;
    this.player.row = 0;
    this.player.col = 0;

    // Reset visited flags
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c].visited = false;
      }
    }

    this.playAudioBlip('click');
    this.startTimer();
    this.draw();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (this.state !== 'playing') return;

    let nextRow = this.player.row;
    let nextCol = this.player.col;
    let wallCheck: keyof Cell['walls'] | null = null;

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      nextRow--;
      wallCheck = 'top';
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      nextCol++;
      wallCheck = 'right';
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      nextRow++;
      wallCheck = 'bottom';
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      nextCol--;
      wallCheck = 'left';
    }

    if (wallCheck !== null && this.isValidCell(nextRow, nextCol)) {
      const currentCell = this.grid[this.player.row][this.player.col];
      // Move player only if there is no wall
      if (!currentCell.walls[wallCheck]) {
        this.player.row = nextRow;
        this.player.col = nextCol;
        this.playerSteps++;
        this.playAudioBlip('keypress');

        // Mark current cell as visited to leave breadcrumbs
        this.grid[this.player.row][this.player.col].visited = true;

        // Check escape win condition
        if (this.player.row === this.rows - 1 && this.player.col === this.cols - 1) {
          this.state = 'solved';
          this.stopTimer();
          this.playAudioBlip('win');
        }

        this.draw();
      } else {
        this.playAudioBlip('glitch');
      }
    }
  }

  // Timer controls
  startTimer() {
    this.stopTimer();
    this.timerSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Draw core function
  draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#030205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background matrix dot grid
    ctx.fillStyle = 'rgba(0, 245, 170, 0.04)';
    const dotSpacing = 20;
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    const padding = 20;
    const w = canvas.width - padding * 2;
    const h = canvas.height - padding * 2;
    const cellW = w / this.cols;
    const cellH = h / this.rows;

    // A. Render cell colors (visited & solution paths)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const cx = padding + c * cellW;
        const cy = padding + r * cellH;

        if (this.state === 'playing' && cell.visited) {
          // Breadcrumbs trace path
          ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
          ctx.fillRect(cx, cy, cellW, cellH);
        } else if (cell.visited && this.state !== 'playing') {
          // BFS explore color (indigo)
          ctx.fillStyle = 'rgba(99, 102, 241, 0.18)';
          ctx.fillRect(cx, cy, cellW, cellH);
        }
      }
    }

    // Draw solid neon green solution path
    if (this.solutionPath.length > 0) {
      ctx.strokeStyle = '#00f5aa';
      ctx.lineWidth = Math.max(2, Math.min(6, cellW * 0.25));
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f5aa';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      this.solutionPath.forEach((cell, idx) => {
        const cx = padding + cell.col * cellW + cellW / 2;
        const cy = padding + cell.row * cellH + cellH / 2;
        if (idx === 0) {
          ctx.moveTo(cx, cy);
        } else {
          ctx.lineTo(cx, cy);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }

    // B. Draw Start & End labels
    ctx.font = `bold ${Math.max(8, Math.min(13, cellW * 0.4))}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Start "S" (Green Glow)
    const sx = padding + cellW / 2;
    const sy = padding + cellH / 2;
    ctx.fillStyle = 'rgba(0, 245, 170, 0.15)';
    ctx.beginPath();
    ctx.arc(sx, sy, cellW * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f5aa';
    ctx.fillText('S', sx, sy);

    // End "E" (Pink Glow)
    const ex = padding + (this.cols - 1) * cellW + cellW / 2;
    const ey = padding + (this.rows - 1) * cellH + cellH / 2;
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    ctx.beginPath();
    ctx.arc(ex, ey, cellW * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ec4899';
    ctx.fillText('E', ex, ey);

    // C. Draw walls
    ctx.strokeStyle = 'rgba(0, 245, 170, 0.65)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00f5aa';

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const cx = padding + c * cellW;
        const cy = padding + r * cellH;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellW, cy);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(cx + cellW, cy);
          ctx.lineTo(cx + cellW, cy + cellH);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(cx + cellW, cy + cellH);
          ctx.lineTo(cx, cy + cellH);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(cx, cy + cellH);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      }
    }
    ctx.shadowBlur = 0; // reset

    // D. Draw Player dot inside play mode
    if (this.state === 'playing') {
      const px = padding + this.player.col * cellW + cellW / 2;
      const py = padding + this.player.row * cellH + cellH / 2;
      const size = cellW * 0.28;

      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ec4899';
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(px - size, py - size, size * 2, size * 2);
      ctx.shadowBlur = 0;

      // Inner blinking dot
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - size * 0.4, py - size * 0.4, size * 0.8, size * 0.8);
    }
  }

  // Neighbor calculations helper methods
  private getUnvisitedNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const { row, col } = cell;

    if (row > 0 && !this.grid[row - 1][col].visited) neighbors.push(this.grid[row - 1][col]);
    if (col < this.cols - 1 && !this.grid[row][col + 1].visited) neighbors.push(this.grid[row][col + 1]);
    if (row < this.rows - 1 && !this.grid[row + 1][col].visited) neighbors.push(this.grid[row + 1][col]);
    if (col > 0 && !this.grid[row][col - 1].visited) neighbors.push(this.grid[row][col - 1]);

    return neighbors;
  }

  private getReachableNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const { row, col, walls } = cell;

    if (!walls.top && row > 0) neighbors.push(this.grid[row - 1][col]);
    if (!walls.right && col < this.cols - 1) neighbors.push(this.grid[row][col + 1]);
    if (!walls.bottom && row < this.rows - 1) neighbors.push(this.grid[row + 1][col]);
    if (!walls.left && col > 0) neighbors.push(this.grid[row][col - 1]);

    return neighbors;
  }

  private removeWalls(c1: Cell, c2: Cell) {
    const x = c1.col - c2.col;
    if (x === 1) {
      c1.walls.left = false;
      c2.walls.right = false;
    } else if (x === -1) {
      c1.walls.right = false;
      c2.walls.left = false;
    }

    const y = c1.row - c2.row;
    if (y === 1) {
      c1.walls.top = false;
      c2.walls.bottom = false;
    } else if (y === -1) {
      c1.walls.bottom = false;
      c2.walls.top = false;
    }
  }

  private isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  exitToPortfolio() {
    this.stopTimer();
    this.exit.emit();
  }

  // Synthesized sound effects via Web Audio API
  private playAudioBlip(type: 'click' | 'hover' | 'keypress' | 'glitch' | 'win') {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } 
      else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
      else if (type === 'keypress') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + Math.random() * 80, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } 
      else if (type === 'glitch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.12);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } 
      else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {}
  }
}

type Grid = Cell[][];
