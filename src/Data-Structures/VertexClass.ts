export class Vertex<T> {
    value: string;
    x: number;
    y: number;
  
    constructor(value: string, x: number, y: number) {
      this.value = value;
      this.x = x;
      this.y = y;
    }

    changeX (newX:number) {
        this.x = newX
    }

    changeY (newY:number){
      this.y = newY
    }
  }