class Test {
    events = ['1', '2', '3', '4', '5'];
    pendingFlush = 0;

    async emit(event) {
        this.events.push(event);

        await this.flush();
        console.log(this.pendingFlush);
    }

    flush() {
        return new Promise((resolve) => {
            console.count('flush');
            console.log(this.pendingFlush);
            if(this.pendingFlush !== 0) {
                clearTimeout(this.pendingFlush);
            }

            this.pendingFlush = setTimeout(() => {
                console.log('Flushing...');
                while (this.events.length > 0) {
                    console.log('queue length:' + this.events.length);
                    console.log('Event id:' + this.events[0]);

                    this.events.splice(0, 1);
                }

                this.pendingFlush = 0;
                console.log('Flushed');
                resolve();
            }, 100)
        })
    }
}

const test = new Test();

test.emit('6');

setTimeout(() => {
    test.emit('2');
}, 50)

