import Main from "../Main.vue";
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

describe("Main.vue", () => {
  it("Async component", async () => {
    const wrapper = await mount(Main);

    await flushPromises();

    await wrapper.setData({ cardsRemaining: 1 });

    expect(wrapper.find('[data-test-id="remaining"]').exists()).toBe(true);
  });
});
