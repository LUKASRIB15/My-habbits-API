import { WatchedList } from "./watched-list";

class NumbersList extends WatchedList<number>{
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe("WatchedList", ()=>{
  it("should be able to get current items", ()=>{
    const numbersList = new NumbersList([0,2,5])

    expect(numbersList.currentItems).toEqual([0,2,5])
  })

  it("should be able to add and remove items", ()=>{
    const numbersList = new NumbersList([0,2,5])

    numbersList.add(1)
    numbersList.add(4)
    numbersList.add(6)

    numbersList.remove(0)
    numbersList.remove(5)

    expect(numbersList.getItems()).toEqual([2,1,4,6])
    expect(numbersList.getNewItems()).toEqual([1,4,6])
    expect(numbersList.getRemovedItems()).toEqual([0,5])
  })

  it("should be able to update items automatically", ()=>{
    const numbersList = new NumbersList([0,2,5])

    numbersList.update([2,1,4,6])

    expect(numbersList.getItems()).toEqual([2,1,4,6])
    expect(numbersList.getNewItems()).toEqual([1,4,6])
    expect(numbersList.getRemovedItems()).toEqual([0,5])
  })
})

// Initial items: [0,2,5]
// new items: [1,4,6]
// removed items: [0,5]
// Current items: [1,2,4,6]