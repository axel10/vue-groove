import {PlayListContentDataItem} from '@/store/modules/playList'

export class PlayList {
  public id: string
  public title: string
  public content: PlayListContentDataItem[]

  constructor() {
    this.id = ''
    this.title = ''
    this.content = []
  }
}
