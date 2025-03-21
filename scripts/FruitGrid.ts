import { _decorator, Component, Node, Vec3 } from 'cc';

export class FruitGrid extends Component {
    private gridSize = { rows: 6, cols: 6 };
    private cellSize = 80;
    private fruits: number[][] = [];
    private selectedFruit: {row: number, col: number} | null = null;
    private touchStartPos: Vec3 = new Vec3();

    start() {
        this.initGrid();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    private initGrid() {
        // 生成初始水果矩阵
        this.fruits = Array(this.gridSize.rows).fill(0)
            .map(() => Array(this.gridSize.cols).fill(0)
            .map(() => Math.floor(Math.random() * 4) + 1));
    }

    public checkMatches(): number {
        let matches = 0;
        // 水平检测
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols - 2; col++) {
                if (this.fruits[row][col] && 
                    this.fruits[row][col] === this.fruits[row][col+1] &&
                    this.fruits[row][col] === this.fruits[row][col+2]) {
                    matches++;
                    this.clearMatch(row, col, 3, 1);
                }
            }
        }
        // 垂直检测
        for (let col = 0; col < this.gridSize.cols; col++) {
            for (let row = 0; row < this.gridSize.rows - 2; row++) {
                if (this.fruits[row][col] && 
                    this.fruits[row][col] === this.fruits[row+1][col] &&
                    this.fruits[row][col] === this.fruits[row+2][col]) {
                    matches++;
                    this.clearMatch(row, col, 1, 3);
                }
            }
        }
        return matches;
    }

    private clearMatch(startRow: number, startCol: number, width: number, height: number) {
        for (let r = startRow; r < startRow + height; r++) {
            for (let c = startCol; c < startCol + width; c++) {
                if (r < this.gridSize.rows && c < this.gridSize.cols) {
                    this.fruits[r][c] = 0;
                }
            }
        }
    }

    public clearCircularArea(centerRow: number, centerCol: number, radius: number) {
        const radiusSq = radius * radius;
        for (let r = 0; r < this.gridSize.rows; r++) {
            for (let c = 0; c < this.gridSize.cols; c++) {
                const dx = c - centerCol;
                const dy = r - centerRow;
                if (dx*dx + dy*dy <= radiusSq) {
                    this.fruits[r][c] = 0;
                }
            }
        }
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = event.getUILocation();
        const localPos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y));
        this.touchStartPos.set(localPos);
        
        const {row, col} = this.gridPosToIndex(localPos);
        if (this.isValidPosition(row, col)) {
            this.selectedFruit = {row, col};
            this.highlightFruit(row, col, true);
        }
    }

    private onTouchMove(event: EventTouch) {
        if (!this.selectedFruit) return;
        
        const touchPos = event.getUILocation();
        const currentPos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y));
        
        // 计算滑动方向
        const deltaX = currentPos.x - this.touchStartPos.x;
        const deltaY = currentPos.y - this.touchStartPos.y;
        
        if (Math.abs(deltaX) > this.cellSize/3 || Math.abs(deltaY) > this.cellSize/3) {
            this.handleSwipe(deltaX, deltaY);
            this.selectedFruit = null;
        }
    }

    private gridPosToIndex(pos: Vec3): {row: number, col: number} {
        const startX = -(this.gridSize.cols * this.cellSize)/2 + this.cellSize/2;
        const startY = -(this.gridSize.rows * this.cellSize)/2 + this.cellSize/2;
        return {
            row: Math.floor((pos.y - startY)/this.cellSize),
            col: Math.floor((pos.x - startX)/this.cellSize)
        };
    }
}