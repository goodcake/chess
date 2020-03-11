import React, {ChangeEvent, Component} from 'react';
import {Card} from "./Card";

interface MyState {
    init: boolean,
    initialDeck: number[],
    deck: number[],
    grave: number[],
    hand: number[],
    draw: number,
    checkWinInput: string,
    win: boolean,
    players: IPlayers,
    turn: number,
    priority: number,
}

type IPlayers = IPlayer[];

type IPlayer = {
    grave: number[],
    hand: number[],
    draw: number,
    flowers: number[],
    taken: number[],
    takenHide: number[],
    playCard: boolean,
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
            init: false,
            initialDeck: initialDeck,
            deck: [],
            grave: [],
            hand: [],
            draw: 99, //99=無牌
            checkWinInput: '',
            win: false,
            players: [],
            turn: 0,
            priority: 0,
        };
        this.winTester();
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

        this.shuffle(deck);

        let initialPlayers: IPlayers = [];
        for (let i = 0; i < 4; i++) {
            let hand: number[] = [];
            for (let x = 0; x < 16; x++) {
                hand.push(deck.shift()!);
            }
            hand.sort(((a, b) => a - b));
            let player: IPlayer = {
                grave: [],
                hand: hand,
                draw: 99,
                flowers: [],
                taken: [],
                takenHide: [],
                playCard: false,
            };
            initialPlayers.push(player);
        }

        this.setState( {
            deck: deck,
            players: initialPlayers,
            init: true
        }, this.drawCard);
    }

    drawCard() {
        console.log('draw', this.state.turn);
        let deck: number[] = this.state.deck;
        let draw: number = deck.shift()!;
        let players: IPlayers = [...this.state.players];
        players[this.state.turn].draw = draw;
        this.setState( {
            deck: deck,
            players: players,
        }, this.check);
    }

    check() {
        // console.log(this.state.players);
    }

    handleCardClick(args: number[]) {
        let [card, owner] = args; //card=點擊的牌 owner=牌的擁有玩家0-3
        let players = [...this.state.players];
        let turn = this.state.turn; //誰的回合
        if (owner !== turn) {return} //不是他的回合的牌打不出來
        let draw = players[turn].draw;
        players[turn].draw = 99;
        if (card === draw) {
            this.setState( (prevState) => ({
                turn: (prevState.turn + 1) % 4,
                players: players,
                grave: [...prevState.grave, card],
            }), this.drawCard);
        } else {
            let hand = players[turn].hand;
            let index = hand.findIndex(element => element === card);
            hand[index] = draw;
            hand.sort(((a, b) => a - b));
            players[turn].hand = hand;
            this.setState((prevState) => ({
                turn: (prevState.turn + 1) % 4,
                players: players,
                grave: [...prevState.grave, card],
            }), this.drawCard);
        }
    }

    handleGraveClick(card: number) {
        console.log(card);
    }

    winTester() {
        const payloads: {result: boolean, payload: number[]}[] = [
            {result: true, payload: [1,1,1,2,2,2,3,3]},
            {result: true, payload: [1,1,1,1,2,2,2,2,3,3,3]},
            {result: true, payload: [2,3,3,3,3,4,5,5]},
            {result: true, payload: [15,15,28,28,28,29,29,29]},
            {result: false, payload: [1,1,1,2,3,4,5,5,7,8,9]},
            {result: false, payload: [1,1,1,2,3,4,5,5,8,9,10]},
            {result: false, payload: [1,1,1,2,3,4,5,5,8,9,10]},
            {result: false, payload: [1,1,1,2,2,27,28,29]},
            {result: false, payload: [1,1,1,2,2,33,33,34,34,34]},
        ];
        payloads.forEach(item => {
            console.log(item.result, this.checkWinPair(item.payload));
        });
    }

    checkWin(checkWinInput: string) {
        let hand: number[] = [];
        this.setState({checkWinInput: checkWinInput});
        for (let x = 0; x < checkWinInput.length; x++) {
            hand.push(parseInt(checkWinInput[x]))
        }
        console.time('loop');
        let win = this.checkWinPair(hand);
        console.log(this.checkWinPair(hand));
        this.setState({
            win: win
        });
        console.timeEnd('loop');
    }

    checkWinPair(hand: number[]): boolean {
        if (hand.length > 1) {
            let tmpHand = [...hand];
            for (let x = 0; x < tmpHand.length; x++) {
                if (tmpHand[x] < 34 && tmpHand[x + 1] - tmpHand[x] === 0) {
                    tmpHand.splice(x, 2);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                    tmpHand = [...hand];
                }
            }
        }
        return false;
    }

    checkThree(hand: number[]): boolean {
        if (hand.length > 2) {
            let tmpHand = [...hand];
            for (let x = 0; x < tmpHand.length; x++) {
                if (tmpHand[x] < 34 && tmpHand[x + 1] - tmpHand[x] === 0 && tmpHand[x + 2] - tmpHand[x + 1] === 0) {
                    tmpHand.splice(x, 3);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                    tmpHand = [...hand];
                }
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
                if (tmpHand[x] < 25
                    && (tmpHand[x] !== 7 && tmpHand[x] !== 8 && tmpHand[x] !== 16 && tmpHand[x] !== 17 && tmpHand[x] !== 25 && tmpHand[x] !== 26)
                    && tmpHand[x + 1] - tmpHand[x] === 1 && tmpHand[x + 2] - tmpHand[x + 1] === 1) {
                    tmpHand.splice(x, 3);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                    tmpHand = [...hand];
                }
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
                if (tmpHand[x] < 23
                    && !((tmpHand[x] > 4 && tmpHand[x] < 9)
                        || (tmpHand[x] > 13 && tmpHand[x] < 18)
                        || (tmpHand[x] > 22 && tmpHand[x] < 27))
                    && tmpHand[x + 2] - tmpHand[x] === 1 && tmpHand[x + 4] - tmpHand[x + 2] === 1) {

                    tmpHand.splice(x + 4, 1);
                    tmpHand.splice(x + 2, 1);
                    tmpHand.splice(x, 1);
                    if (this.checkThree(tmpHand)) {return true}
                    if (this.checkSeries(tmpHand)) {return true}
                    if (this.checkSeries2(tmpHand)) {return true}
                    tmpHand = [...hand];
                }
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
                {this.state.init?
                    <div>
                        <div>玩家0手牌</div>
                        <div>
                            {this.state.players[0].hand.map((card, index) => {
                                return <Card key={index} card={card} onCardClick={this.handleCardClick.bind(this, [card, 0])} />
                            })}
                        </div>
                        <div>進牌</div>
                        {
                            this.state.players[0].draw < 99 ?
                                <div>
                                    <Card card={this.state.players[0].draw} onCardClick={this.handleCardClick.bind(this, [this.state.players[0].draw, 0])} />
                                </div>
                                : <div></div>
                        }

                        <div>玩家1手牌</div>
                        <div>
                            {this.state.players[1].hand.map((card, index) => {
                                return <Card key={index} card={card} onCardClick={this.handleCardClick.bind(this, [card, 1])} />
                            })}
                        </div>
                        <div>進牌</div>
                        {
                            this.state.players[1].draw < 99 ?
                                <div>
                                    <Card card={this.state.players[1].draw} onCardClick={this.handleCardClick.bind(this, [this.state.players[1].draw, 1])} />
                                </div>
                                : <div></div>
                        }

                        <div>玩家2手牌</div>
                        <div>
                            {this.state.players[2].hand.map((card, index) => {
                                return <Card key={index} card={card} onCardClick={this.handleCardClick.bind(this, [card, 2])} />
                            })}
                        </div>
                        <div>進牌</div>
                        {
                            this.state.players[2].draw < 99 ?
                                <div>
                                    <Card card={this.state.players[2].draw} onCardClick={this.handleCardClick.bind(this, [this.state.players[2].draw, 2])} />
                                </div>
                                : <div></div>
                        }

                        <div>玩家3手牌</div>
                        <div>
                            {this.state.players[3].hand.map((card, index) => {
                                return <Card key={index} card={card} onCardClick={this.handleCardClick.bind(this, [card, 3])} />
                            })}
                        </div>
                        <div>進牌</div>
                        {
                            this.state.players[3].draw < 99 ?
                                <div>
                                    <Card card={this.state.players[3].draw} onCardClick={this.handleCardClick.bind(this, [this.state.players[3].draw, 3])} />
                                </div>
                                : <div></div>
                        }
                    </div>
                    :null}

                <div>墳場</div>
                <div>
                    {this.state.grave.map((card, index) => {
                        return <Card key={index} card={card} onCardClick={this.handleGraveClick.bind(this, card)} />
                    })}
                </div>
                <div><button onClick={() => this.initial()}>Reset</button></div>

                {/* check win tester */}
                <input type="text" onChange={event => this.checkWin(event.target.value)}/>
                {this.state.win?<span>胡</span>:null}
                <div>
                    {Array.from(this.state.checkWinInput).map((strCard, index) => {
                        let card: number = parseInt(strCard);
                        return <Card key={index} card={card} onCardClick={this.handleGraveClick.bind(this, card)} />
                    })}
                </div>

            </div>
        )}
}