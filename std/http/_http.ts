
class HTTPHeaders extends Headers {
  #Trailers: Map<string, string> | undefined;

  constructor(...params: ([string, string] | {[key: string]:string})[] ) {
    super();
    const self = this;
    params.forEach((header) => {
      Array.isArray(header) ? self.append(header[0], header[1]) : Object.keys(header).forEach((key) => {
        self.append(key, header[key]);
      });
    })
  }

  private registerTrailers(name: string, value: string) {
    if (name.toLocaleLowerCase() === "trailers") {
      if (this.#Trailers) return false;
      const Trailers = this.#Trailers = new Map<string, string>();
      value.split(' ').forEach((head_id) => {
        let header = super.get(head_id);
        if (header) {
          super.delete(head_id);
          Trailers.set(head_id, header);
        } else Trailers.set(head_id, "");
      });
      super.set('Trailers', value);
      return true;
    }
    return false;
  }

  public append(name: string, value: string): boolean {
    let key;
    if (this.registerTrailers(name, value))
      return true;
    if (this.#Trailers && (key = this.#Trailers.get(name))) {
      if (key === "") {
        this.#Trailers.set(name, value);
        super.append("Trailers", [...this.#Trailers.keys()].join(" "));
        return true;
      }
      return false;
    }
    super.append(name, value);
    return true;
  }

  public has(name: string): boolean {
    return this.#Trailers ? this.#Trailers.has(name) : super.has(name);
  }

  public get(name: string): string | null {
    return super.get(name) || this.#Trailers ? (<Map<string, string>>this.#Trailers).get(name) || null : null;
  }

  public values(): IterableIterator<string> {
    return Array.prototype.concat.call(
      super.values(),
      (this.#Trailers ?? []).values(),
    ).values();
  }

  public set(name: string, value: string) {
    if (this.registerTrailers(name, value))
      return;
    if (this.#Trailers && this.#Trailers.has(name)) {
      this.#Trailers.set(name, value);
      super.append("Trailers", [...this.#Trailers.keys()].join(" "));
    } else super.set(name, value);
  }

  public delete(name: string) {
    if (name.toLocaleLowerCase() === "trailers" && this.#Trailers) {
      this.#Trailers = undefined;
    } else if (this.#Trailers && this.#Trailers.has(name)) {
      this.#Trailers.delete(name);
      super.append("Trailers", [...this.#Trailers.keys()].join(" "));
    }
    super.delete(name);
  }
}

export default HTTPHeaders;
