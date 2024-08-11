export class Store {
  private subscribers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get value() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    this.notify();
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== fn);
    };
  }

  dispatch(action) {
    // this.state = {
    //   /** it is copying the previous state data so if it has a todos, it will have a todo */
    //   ...this.state,
    //   /** after it is done copying that state, then we access it with todos */
    //   todos: [...this.state.todos, action.payload],
    // };
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  private notify() {
    /**loop through subscribers list and pass the state (value) */
    this.subscribers.forEach((fn) => fn(this.value));
  }

  private reduce(state, action) {
    const newState = {};
    /** prop is the key of the object from reducers */
    for (const prop in this.reducers) {
      /**this then becomes newState.todos  which is essentially
       * newState.todos = this.reducers.todos()
       *
       * loop over all reducers
       * create new object property for each one
       * bind the value as the result of each reducer
       * each reducer manages its own property reducer.todo(state.todo, action)
       */

      newState[prop] = this.reducers[prop](state[prop], action);
    }
    return newState;
  }
}
