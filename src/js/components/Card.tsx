import React, { Component } from 'react';
interface MyProps {
    card: number,
    onCardClick: Function,
}

export class Card extends Component<MyProps, {}> {
    parser(cardId: number): string {
        switch (cardId) {
            case 0:
                return '一萬';
            case 1:
                return '二萬';
            case 2:
                return '三萬';
            case 3:
                return '四萬';
            case 4:
                return '五萬';
            case 5:
                return '六萬';
            case 6:
                return '七萬';
            case 7:
                return '八萬';
            case 8:
                return '九萬';
            case 9:
                return '一筒';
            case 10:
                return '二筒';
            case 11:
                return '三筒';
            case 12:
                return '四筒';
            case 13:
                return '五筒';
            case 14:
                return '六筒';
            case 15:
                return '七筒';
            case 16:
                return '八筒';
            case 17:
                return '九筒';
            case 18:
                return '一條';
            case 19:
                return '二條';
            case 20:
                return '三條';
            case 21:
                return '四條';
            case 22:
                return '五條';
            case 23:
                return '六條';
            case 24:
                return '七條';
            case 25:
                return '八條';
            case 26:
                return '九條';
            case 27:
                return '東';
            case 28:
                return '西';
            case 29:
                return '南';
            case 30:
                return '北';
            case 31:
                return '中';
            case 32:
                return '發';
            case 33:
                return '白';
            case 34:
                return '春';
            case 35:
                return '夏';
            case 36:
                return '秋';
            case 37:
                return '冬';
            case 38:
                return '梅';
            case 39:
                return '蘭';
            case 40:
                return '菊';
            case 41:
                return '竹';
            default:
                return '';
        }
    }
    render() {
        const cardStyle = {border: "1px solid black", margin: "0 2px", padding: "0 5px", display: "inline-block", width: "2em", cursor: "pointer"};
        return (
            <div style={cardStyle} onClick={() => this.props.onCardClick(this.props.card)}>
                {this.parser(this.props.card)}
            </div>
        )}
}