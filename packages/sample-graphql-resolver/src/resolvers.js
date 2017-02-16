const UserAccount = {};

const resolvers = {
  RootQuery: {
    async me(_, args, context) {
      return await UserAccount.get(context.userId);
    },
    async user(_, args, context) {
      return await UserAccount.get(args.id);
    }
  },
  RootMutation: {
    async createAccount(_, args, context) {
      let {username, email, password} = args.user;
      return await UserAccount.create(username, email, password, args.profile);
    },
    async createAccountAndLogin(_, args, context) {
      let {username, email, password} = args.user;
      await UserAccount.create(username, email, password, args.profile);
      return await UserAccount.login(username, email, password);
    },
    async loginWithPassword(_, args, context) {
      let {username, email, password} = args.user;
      return await UserAccount.login(username, email, password);
    },
  },
  User: {
    id: (user)=>user._id,
    email: (user)=>(user.emails && user.emails[0] && user.emails[0].address),
    username: (user)=>user.username,
  },
  Token: {
    userId: (token) => token.userId,
    token: (token) => token.token,
    tokenExpiration: (token)=>token.tokenExpiration.getTime(),
  }
};

export default resolvers;