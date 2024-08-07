declare interface IDeck {
    deck_id: number,
    name: string,
    course: string,
    course_id: number,
    cards: {
        [cardId: number]: {
            card_id: number,
            question: string,
            answer: string,
            confidence: number
        }
    },
    stats: {
        completion: number,
        confidence: number
    }
}
export default IDeck;
    