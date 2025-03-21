import { _decorator, Component, resources } from 'cc';
import { UIManager } from './UIManager';

export class GameManager extends Component {
    // 游戏状态管理
    private currentLevel: number = 1;
    private score: number = 0;

    start() {
        this.preloadResources(() => {
            this.loadLevelConfig(this.currentLevel);
            this.node.getComponent(UIManager)?.hideLevelSelect();
        });
    }

    private preloadResources(callback: Function) {
        resources.preloadDir('textures/fruits', (err) => {
            if (!err) resources.preloadDir('audio', callback);
        });
    }

    private loadLevelConfig(level: number) {
        const levelData = this.getLevelData(level);
        const fruitGrid = this.node.getComponent(FruitGrid);
        if (levelData && fruitGrid) {
            fruitGrid.gridSize = levelData.gridSize;
            fruitGrid.initGrid();
        }
    }

    private getLevelData(level: number) {
        return require('../resources/levels/levelConfig.json').levels
            .find(l => l.level === level);
    }

    public addScore(points: number) {
        this.score += points;
        this.node.getComponent(UIManager)?.updateScore(this.score);
    }

    public useBomb() {
        const fruitGrid = this.node.getComponent(FruitGrid);
        if (fruitGrid) {
            fruitGrid.clearCircularArea(
                Math.floor(fruitGrid.gridSize.rows/2),
                Math.floor(fruitGrid.gridSize.cols/2),
                2
            );
            this.scheduleOnce(() => fruitGrid.checkMatches(), 0.5);
        }
    }
}