/* eslint-disable */
export default () => {
  // performance test
  const fib = (x) => {
    if (x <= 0) return 0;
    if (x === 1) return 1;
    return fib(x - 1) + fib(x - 2);
  };


  self.addEventListener('message', e => {
    switch (e.data.event) {
      case 'fibonacci':
        const num = fib(25);

        return void self.postMessage({
          data: {
            result: num
          },
          event: 'fibonacci'
        });

      default:
        self.postMessage(e.data);
    }
  })
}
