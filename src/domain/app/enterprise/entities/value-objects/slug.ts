export class Slug {
  private value: string

  toString(){
    return this.value
  }

  constructor(value: string){
    this.value = value
  }

   /**
   * Receives a string and normalize it
   * 
   * Example: "An example question" => "an-example-question"
   * 
   * @param text {string}
   */
   static createFromText(text: string){
    const slug = text
      .normalize("NFKD")
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slug)
  }

}