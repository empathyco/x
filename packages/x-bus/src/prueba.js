class Test {
  events = [];
  pendingFlush = 0;
  promises = {};
  iTimeout = 0;

  async emit(event) {
    this.events.push(event);

    const promise = new Promise(resolve => {
      this.promises[event] = resolve;
    });

    this.flush();

    return promise;
  }

  flush() {
    if (this.pendingFlush !== 0) {
      console.log('clear timeout');
      clearTimeout(this.pendingFlush);
      clearTimeout(this.iTimeout);
    }

    console.log('Flushing...');
    const queue = this.events;
    while (queue.length > 0) {
      console.log('queue: ' + queue);

      const ele = queue[0];

      queue.splice(0, 1);
      this.pendingFlush = setTimeout(async () => {
        await new Promise((resolve, reject) => {
          this.iTimeout = setTimeout(() => {
            resolve();
          }, 20);
        });

        if (this.promises[ele]) {
          await this.promises[ele]();
        }
      }, 0);
    }

    this.pendingFlush = 0;
    this.events = [];
    console.log('Flushed');
  }
}

const test = new Test();

test.emit('1').then(() => console.log('1 emitted'));
test.emit('2').then(() => console.log('2 emitted'));
test.emit('3').then(() => console.log('3 emitted'));
test.emit('4').then(() => console.log('4 emitted'));
test.emit('5').then(() => console.log('5 emitted'));
test.emit('6').then(() => console.log('6 emitted'));

setTimeout(() => {
  test.emit('7').then(() => console.log('7 emitted'));
}, 50);
