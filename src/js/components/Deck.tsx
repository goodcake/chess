import React, {ChangeEvent, Component} from 'react';
import {Card} from "./Card";

interface MyState {
    initialDeck: number[],
    deck: number[],
    grave: number[],
    hand: number[],
    draw: number,
    checkWinInput: string,
}

export class Deck extends Component<{}, MyState> {
    // The tick function sets the current state. TypeScript will let us know
    // which ones we are allowed to set.
    constructor(props: Readonly<{}>) {
        super(props);
        let initialDeck: number[] = [];
        //加萬筒條東西南北中發白
        for (let x = 0; x < 34; x++) {
            for (let y = 0; y < 4; y++) {
                initialDeck.push(x);
            }
        }
        //加花
        for (let x = 34; x < 42; x++) {
            initialDeck.push(x);
        }
        this.state = {
            initialDeck: initialDeck,
            deck: [],
            grave: [],
            hand: [],
            draw: 99, //99=無牌
            checkWinInput: '',
        }
    }
    shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

            // swap elements array[i] and array[j]
            // we use "destructuring assignment" syntax to achieve that
            // you'll find more details about that syntax in later chapters
            // same can be written as:
            // let t = array[i]; array[i] = array[j]; array[j] = t
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    initial() {
        let deck: number[] = [...this.state.initialDeck];
        let hand: number[] = [];

        this.shuffle(deck);
        for (let x = 0; x < 16; x++) {
            hand.push(deck.shift()!);
        }

        hand.sort(((a, b) => a - b));
        this.setState( {
            deck: deck,
            grave: [],
            hand: hand,
        }, this.drawCard);
    }

    drawCard() {
        console.log('draw');
        let deck: number[] = this.state.deck;
        let draw: number;
        draw = deck.shift()!;
        this.setState( {
            deck: deck,
            draw: draw,
        });
    }

    handleCardClick(card: number) {
        if (card === this.state.draw) {
            this.setState( (prevState) => ({
                draw: 99,
                grave: [...prevState.grave, card],
            }), this.drawCard);
        } else {
            let hand = this.state.hand;
            let index = hand.findIndex(element => element === card);
            hand[index] = this.state.draw;
            hand.sort(((a, b) => a - b));
            this.setState((prevState) => ({
                draw: 99,
                hand: hand,
                grave: [...prevState.grave, card],
            }), this.drawCard);
        }
    }

    handleGraveClick(card: number) {
        console.log(card);
    }

    checkWin(event: ChangeEvent<HTMLInputElement>) {
        let checkWinInput = event.target.value;
        let hand: number[] = [];
        this.setState({checkWinInput: checkWinInput});
        for (let x = 0; x < checkWinInput.length; x++) {
            hand.push(parseInt(checkWinInput[x]))
        }
        console.time('loop');
        console.log(this.checkWinPair(hand));
        console.timeEnd('loop');
    }

    checkWinPair(hand: number[]): boolean {
        if (hand.length > 1) {
            let tmpHand = [...hand];
            for (let x = 0; x < tmpHand.length; x++) {
                if (tmpHand[x + 1] - tmpHand[x] === 0) {
                    tmpHand.splice(x, 2);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                }
                tmpHand = [...hand];
            }
        }
        return false;
    }

    checkThree(hand: number[]): boolean {
        if (hand.length > 2) {
            let tmpHand = [...hand];
            for (let x = 0; x < tmpHand.length; x++) {
                if (tmpHand[x + 1] - tmpHand[x] === 0 && tmpHand[x + 2] - tmpHand[x + 1] === 0) {
                    tmpHand.splice(x, 3);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                }
                tmpHand = [...hand];
            }
        } else if (hand.length === 0) {
            return true;
        }
        return false;
    }

    checkSeries(hand: number[]): boolean {
        if (hand.length > 2) {
            let tmpHand = [...hand];
            for (let x = 0; x < tmpHand.length; x++) {
                if (tmpHand[x + 1] - tmpHand[x] === 1 && tmpHand[x + 2] - tmpHand[x + 1] === 1) {
                    tmpHand.splice(x, 3);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                }
                tmpHand = [...hand];
            }
        } else if (hand.length === 0) {
            return true;
        }
        return false;
    }

    checkSeries2(hand: number[]): boolean {
        if (hand.length > 2) {
            let tmpHand = [...hand];
            for (let x = 0; x < tmpHand.length; x++) {
                if (tmpHand[x + 2] - tmpHand[x] === 1 && tmpHand[x + 4] - tmpHand[x + 2] === 1) {
                    tmpHand.splice(x + 4, 1);
                    tmpHand.splice(x + 2, 1);
                    tmpHand.splice(x, 1);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                }
                tmpHand = [...hand];
            }
        } else if (hand.length === 0) {
            return true;
        }
        return false;
    }
    // After the component did mount, we set the state each second.
    componentDidMount() {
        this.initial();
    }

    // render will know everything!
    render() {
        return (
            <div>
                <div>手牌</div>
                <div>
                    {this.state.hand.map((card, index) => {
                        return <Card key={index} card={card} onCardClick={this.handleCardClick.bind(this, card)} />
                    })}
                </div>
                <div>進牌</div>
                {
                    this.state.draw < 99 ?
                        <div>
                            <Card card={this.state.draw} onCardClick={this.handleCardClick.bind(this, this.state.draw)} />
                        </div>
                        :
                        <div></div>
                }

                <div>墳場</div>
                <div>
                    {this.state.grave.map((card, index) => {
                        return <Card key={index} card={card} onCardClick={this.handleGraveClick.bind(this, card)} />
                    })}
                </div>

                <div><button onClick={() => this.initial()}>Reset</button></div>

                <input type="text" onChange={event => this.checkWin(event)}/>
                <div>{this.state.checkWinInput}</div>
            </div>
        )}
}