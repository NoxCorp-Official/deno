
enum HTTPMethod {
  GET,
  POST,
  HEAD,
  PUT,
  DELETE,
  CONNECT
}

namespace HTTPMethod {
  export function toString(method: HTTPMethod): string {
    return HTTPMethod[method];
  }

  export function get(method: string): HTTPMethod {
    return HTTPMethod[method as keyof typeof HTTPMethod] as HTTPMethod;
  }

}

// @ts-ignore
export default HTTPMethod;
