import { mount } from '@vue/test-utils';
import HomeBottom from '@/components/HomeBottom.vue';
describe('DropDown', function () {
    it('should dropDown show', function () {
        const wrapper = mount(HomeBottom);
        const fn = jest.fn(x => x);
        wrapper.setMethods({ togglePlay: fn });
        wrapper.find('.play').trigger('click');
        expect(fn).toBeCalled();
    });
});
//# sourceMappingURL=HelloWorld.spec.js.map