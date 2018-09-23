import {File} from '@/store/modules/file';
import Vue from 'vue';
// @ts-ignore
import config from '@/utils/config';
// @ts-ignore
import Confirm from '@/components/Common/Confirm';
// @ts-ignore
import CreatePlayListModal from '@/components/CreatePlayListModal';

// @ts-ignore
import DropdownList from '@/components/Common/DropdownList';
import store from '@/store/index';
import {Sortable, Plugins} from '@shopify/draggable';
import SelectContainer from '@/mixins/selectContainer';
import { PlayListContentDataItem} from '@/store/modules/playList';


function _initResourceUrl(arr: Array<File>, path: Array<string>) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].content) {
      _initResourceUrl(arr[i].content || [], path.concat([arr[i].title]));
    } else {
      const imgUrl = `${config.coverPath}/small/${path.join('/')}/${arr[i].title}.jpg`;
      const musicUrl = `${config.musicPath}${path.join('/')}/${arr[i].title}.${config.musicExt}`;

      arr[i].imgUrl = imgUrl;
      arr[i].musicUrl = musicUrl;
    }
  }
}

export function initResourceUrl(arr: Array<File>) {
  _initResourceUrl(arr, []);
}

function _convertFilesToLinearArray(arr: Array<File>, tmp: Array<File>) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].content) {
      _convertFilesToLinearArray(arr[i].content || [], tmp);
    } else {
      tmp.push(arr[i]);
    }
  }
}

export function convertFilesToLinearArray(arr: Array<File>) {
  let tmp: Array<File> = [];
  _convertFilesToLinearArray(arr, tmp);
  return tmp;
}

/*export function isInSelf(node: HTMLElement, target: HTMLElement): boolean {
  if (node === target) {
    return true;
  }
  if (node.parentNode) {
    return isInSelf(<HTMLElement>node.parentNode, target);
  } else {
    return false;
  }
}*/


export function isInSelf(node: HTMLElement, className: string): boolean {
  if (node == document.body) return false;
  if (node.className.indexOf(className) !== -1) {
    return true;
  }
  if (node.parentNode) {
    return isInSelf(<HTMLElement>node.parentNode, className);
  } else {
    return false;
  }
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface confirmConfig {
  title: string,
  info: string,
  onCancel?: Function
}

export function confirm(opt: confirmConfig) {
  return new Promise(((resolve) => {
    let confirm = Vue.extend(Confirm);
    let contain = document.createElement('div');
    document.body.appendChild(contain);

    function remove() {
      vm.$destroy();
      document.body.removeChild(vm.$el);
    }

    var vm = new confirm({
      el: contain,
      propsData: {
        cb: () => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);
          resolve();
        },
        cancel: () => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);

          if (opt.onCancel) {
            opt.onCancel();
          }
          // reject()
        },
        ...opt
      },
    });
    // @ts-ignore
    vm.show = true;
  }));
}

interface editPlayListModalConfig {
  isRename?: boolean
  oldName?: string
  onCancel?: Function
}

export function editPlayListModal(opt?: editPlayListModalConfig) {
  if (!opt) {
    opt = {};
  }
  return new Promise(((resolve) => {
    let contain = document.createElement('div');
    document.body.appendChild(contain);

    function remove() {
      vm.$destroy();
      document.body.removeChild(vm.$el);
    }

    var vm = new CreatePlayListModal({
      el: contain,
      store,
      propsData: {
        cb: (name: string) => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);
          resolve(name);
        },
        cancel: () => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);
          if (opt!.onCancel) {

            // @ts-ignore
            opt!.onCancel();
          }
        },
        ...opt
      },
    });
    // @ts-ignore
    vm.show = true;
  }));
}


export interface DropDownMenuItem {
  label?: string,
  callback?: Function,
  split?: boolean,
  isDisable?: boolean,
  children?: Array<DropDownMenuItem>,
  el?: any
}

export function dropDownMenu(e: Event, opts: Array<DropDownMenuItem>, onCancel?: Function) {   // 传递{split:true}为分割线
  let contain = document.createElement('div');
  document.body.appendChild(contain);

  function remove() {
    vm.$destroy();
    document.body.removeChild(vm.$el);
    onCancel && onCancel();
  }

  var vm = new DropdownList({
    el: contain,
    propsData: {
      e,
      items: opts,
      remove
    },
  });
  // @ts-ignore
  vm.show = true;
}

export function union(arr1: Array<PlayListContentDataItem>, arr2: Array<PlayListContentDataItem>) {
  var arr = [];
  for (let i = 0; i < arr1.length; i++) {
    // if (arr.indexOf(arr1[i]) === -1) {
      if (arr.findIndex(o=>o.title===arr1[i].title&&o.p===arr1[i].p) === -1) {
      arr.push(arr1[i]);
    }
  }
  for (let i = 0; i < arr2.length; i++) {
    if (arr.findIndex(o=>o.title===arr2[i].title&&o.p===arr2[i].p) === -1) {
      arr.push(arr2[i]);
    }
  }
  return arr;
}


export function unionFiles(arr1: Array<File>, arr2: Array<File>) {
  var arr = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr.findIndex(o => o.id === arr1[i].id) === -1) {
      arr.push(arr1[i]);
    }
  }
  for (let i = 0; i < arr2.length; i++) {
    if (arr.findIndex(o => o.id === arr2[i].id) === -1) {
      arr.push(arr2[i]);
    }
  }
  return arr;
}


export function toggleFullScreen() {
  const document: any = window.document;
  const el = document.body;
  const isFullscreen = document.fullScreen || document['mozFullScreen'] || document.webkitIsFullScreen;
  if (!isFullscreen) {//进入全屏,多重短路表达式
    (el.requestFullscreen && el.requestFullscreen()) ||
    (el['mozRequestFullScreen'] && el['mozRequestFullScreen']()) ||
    (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el['msRequestFullscreen'] && el['msRequestFullscreen']());
    store.commit('home/setIsFullScreen', true);

  } else {	//退出全屏,三目运算符
    document.exitFullscreen ? document.exitFullscreen() :
      document['mozCancelFullScreen'] ? document['mozCancelFullScreen']() :
        document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
    store.commit('home/setIsFullScreen', false);
  }
}

export function fullScreen() {
  const el: any = document.body;
  (el.requestFullscreen && el.requestFullscreen()) ||
  (el['mozRequestFullScreen'] && el['mozRequestFullScreen']()) ||
  (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el['msRequestFullscreen'] && el['msRequestFullscreen']());
  store.commit('home/setIsFullScreen', true);
}

export function exitFullScreen() {
  const document: any = window.document;
  document.exitFullscreen ? document.exitFullscreen() :
    document['mozCancelFullScreen'] ? document['mozCancelFullScreen']() :
      document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
}

export function isFullScreen() {
  const document: any = window.document;
  return document.fullScreen || document['mozFullScreen'] || document.webkitIsFullScreen;
}

export function fadeInFileContent() {
  const content = <HTMLElement> document.querySelector('.Files>.content');
  content.className = 'content';
  // content.style.opacity = '0'
  content.style.visibility = 'hidden';
  setTimeout(() => {
    // content.style.opacity = '1'
    content.style.visibility = 'visible';

    content.className = 'content fade-in';
  });
}


export function getAllFileByContent(content: Array<File>): Array<File> {
  let tmp: Array<File> = [];

  function pushItem(content: Array<File>) {
    for (let i = 0; i < content.length; i++) {
      if (content[i].content) {
        pushItem(content[i].content);
      } else {
        tmp.push(content[i]);
      }
    }
  }

  pushItem(content);
  return tmp;
}

export function getAddFileToContextMenuItems(files: Array<File>, context?: SelectContainer) {
  const contextMenu: any = [];
  files = getAllFileByContent(files);
  contextMenu.push({
    label: '正在播放',
    callback: () => {
      store.dispatch('playList/addToPlayingList', files);
      if (context) {
        context.selectedItems = [];
      }
    }
  });
  contextMenu.push({split: true});

  contextMenu.push({
    label: '新的播放列表', callback: () => {
      editPlayListModal().then(name => {
        // store.dispatch('playList/createPlayList', {name, fileIds: files.map(o => o.id)});
        store.dispatch('playList/createPlayList', {
          name,
          content: files.map((o: File) => new PlayListContentDataItem(o.title, o.p))
        });
        if (context) {
          context.selectedItems = [];
        }
      });
    }
  });

  const playLists = store.state.playList.playLists;

  if (playLists.length > 0) {
    playLists.forEach(o => {
      contextMenu.push({
        label: o.title,
        callback: () => {
          store.dispatch('playList/addToPlayList', {
            listId: o.id,
            // ids: files.map(o => o.id)
            content: files.map(o => new PlayListContentDataItem(o.title,o.p))
          });
          if (context) {
            context.selectedItems = [];
          }
        }
      });
    });
  }

  return contextMenu;
}


export function mapDataItemsToFiles(items: Array<PlayListContentDataItem>): Array<File> {
  // return store.state.file.allFile.filter(o => ids.indexOf(o.id) !== -1);
  var res: Array<File> = [];
  const allFile = store.state.file.allFile;
  items.forEach(item => {
    // res.push(allFile.find(o => o.id === id) || new File());
    res.push(allFile.find(o => o.title === item.title && o.p === item.p) || new File());
  });
  return res;
}

export interface SortListHack {
  onStart?: Function
  onSort?: Function
  onEnd?: Function
}

export function SortList(container: HTMLElement, hacks: SortListHack, opt?: any) {
  const {onStart, onSort, onEnd} = hacks;
  const mergeOpt = {
    draggable: 'li',
    // delay:300,
    swapAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
      horizontal: true,
    },
    plugins: [Plugins.SwapAnimation],
    ...opt

  };
  const sortable = new Sortable(container, mergeOpt);
  if (onStart) sortable.on('sortable:start', onStart);
  if (onSort) sortable.on('sortable:sort', onSort);
  if (onEnd) sortable.on('sortable:stop', onEnd);
}

export function playAllSelectFile(context: SelectContainer) {

  context.$store.dispatch('file/playDirs', context.selectedItems);
  context.selectedItems = [];
}

/*export function playAllFile(files: File[]) {
  store.dispatch('file/playDirs', files);
}*/

/*export function playAllSelectFile(context: SelectContainer, files: Array<File>) {
  files.sort(function (e1, e2) {
    if (e1.trck > e2.trck) return 1;
    if (e1.trck < e2.trck) return -1;
    return 0;
  });
  context.$store.dispatch('file/playDirs', context.selectedItems);
  context.selectedItems = [];
}*/

/*export function addFileToPlayList(context: SelectContainer, content: Array<PlayListContentDataItem>, listId: string) {
  context.$store.dispatch('playList/addToPlayList', {listId, content:});
}*/

export function getLargeImg(url: string) {
  return url.replace('/small/', '/large/');
}

export function beginAddTime() {
  const state = store.state.audio;
  clearInterval(state.timer);
  const timer = setInterval(() => {
    store.commit('audio/addCurrentTime');
  }, 1000 / state.fps);
  store.commit('audio/setTimer', timer);
}

export function convertTimeStrToSecond(timeStr: string): number {
  const time = timeStr.split(':').map(o => parseInt(o));
  return time[0] * 60 + time[1];
}

export function getOffsetTop(obj: HTMLElement): number {
  return obj.offsetTop + (obj.offsetParent ? getOffsetTop(<HTMLElement>obj.offsetParent) : 0);
}

export function getOffsetLeft(obj: HTMLElement): number {
  return obj.offsetLeft + (obj.offsetParent ? getOffsetLeft(<HTMLElement>obj.offsetParent) : 0);
}
