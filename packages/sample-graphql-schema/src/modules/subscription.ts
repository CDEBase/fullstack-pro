export const typeDef = `
    type Subscription {
        # Subscription fires on every comment added
        clock(onlyMinutesChange: Boolean): String
    }
`;


export const resolver = {
    Subscription: {
        clock(root) {
            return new Date();
        }
    }
}