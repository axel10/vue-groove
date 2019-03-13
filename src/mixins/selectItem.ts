import Vue from 'vue'
import {Prop} from 'vue-property-decorator'
import {BaseItem} from '@/types/BaseItem'




export default class SelectItem extends Vue {
  @Prop(Array) public selectedItems!: BaseItem[]
  @Prop(Object) public item!: BaseItem


  get selected() {
    return this.selectedItems.findIndex((o: any) => o.id === this.item.id) !== -1
  }

  public toggleSelect(e: MouseEvent) {
    e.stopPropagation()
    if (this.selected) {
      this.$emit('select', this.selectedItems.filter((o: any) => o.id !== this.item.id))
    } else {
      this.$emit('select', this.selectedItems.concat([this.item]))
    }
  }

  get isSelectMode() {
    return this.selectedItems.length > 0
  }
}
