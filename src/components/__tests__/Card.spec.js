import { describe, expect, it } from "vitest";

import { shallowMount } from "@vue/test-utils";
import Card from "../Card.vue";

describe("Card.vue", () => {
  it("render noImage", () => {
    const wrapper = shallowMount(Card, { props: {} });
    expect(wrapper.find(".isImage").exists()).toBe(false);
    expect(wrapper.find(".noImage").exists()).toBe(true);
  });
  it("render isImage", () => {
    const wrapper = shallowMount(Card, {
      props: {
        image: "tempUrl",
      },
    });
    expect(wrapper.find(".isImage").exists()).toBe(true);
    expect(wrapper.find(".noImage").exists()).toBe(false);
  });
});
