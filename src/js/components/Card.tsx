import React, { Component } from 'react';

interface MyProps {
    card: string,
}

export class Card extends Component<MyProps, {}> {

    // The tick function sets the current state. TypeScript will let us know
    // which ones we are allowed to set.
    constructor(props: MyProps) {
        super(props);
    }

    // After the component did mount, we set the state each second.
    componentDidMount() {
    }

    // render will know everything!
    render() {
        const cardStyle = {border: "1px solid black", margin: "0 2px", padding: "0 5px", display: "inline-block", width: "2em", cursor: "pointer"};
        return (
            <div style={cardStyle}>
                {this.props.card}
            </div>
    )}
}