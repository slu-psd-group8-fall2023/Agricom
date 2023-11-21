class Iterator {
  constructor(objects) {
    this.objects = objects;
    this.index = 0;
  }

  next() {
    if (this.index < this.objects.length) {
      return { done: false, value: this.objects[this.index++] };
    } else {
      return { done: true };
    }
  }
}

module.exports = Iterator;
