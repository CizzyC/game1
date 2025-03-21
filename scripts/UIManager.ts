import { _decorator, Component, Label, Button, Widget } from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Button)
    bombButton: Button = null!;

    @property(Node)
    levelSelectPanel: Node = null!;

    private gameManager: GameManager = null!;

    start() {
        this.gameManager = this.node.getComponent(GameManager);
        this.bombButton.node.on(Button.EventType.CLICK, this.useBomb, this);
    }

    updateScore(score: number) {
        this.scoreLabel.string = `得分：${score}`;
    }

    private useBomb() {
        if (this.gameManager) {
            this.gameManager.useBomb();
        }
    }

    showLevelSelect() {
        this.levelSelectPanel.active = true;
    }

    hideLevelSelect() {
        this.levelSelectPanel.active = false;
    }
}