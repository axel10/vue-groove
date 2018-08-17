import Vue from 'vue';
import {Prop} from 'vue-property-decorator';
import {File} from '@/store/modules/file';


export class BaseItem {
  id: any;
  title!: string;
  content!: Array<any>;
}

export default class SelectItem extends Vue {
  @Prop(Array) selectedItems!: Array<BaseItem>;
  @Prop(Object) item!: BaseItem;


  get selected() {
    return this.selectedItems.findIndex((o: any) => o.id === this.item.id) !== -1;
  }

  toggleSelect(e: MouseEvent) {
    e.stopPropagation();
    if (this.selected) {
      this.$emit('select', this.selectedItems.filter((o: any) => o.id !== this.item.id));
    } else {
      this.$emit('select', this.selectedItems.concat([this.item]));
    }
  }

  get isSelectMode() {
    return this.selectedItems.length > 0;
  }
}