import { assert } from "$std/testing/asserts.ts";
import linkService from "./linkService.ts";

// This is a simple test to verify that the linkService can be imported and initialized
// A more comprehensive test would require a mock KV or a test KV instance
Deno.test("linkService initializes correctly", () => {
  // This test just verifies that the linkService can be imported without errors
  // and that it has the expected methods
  assert(typeof linkService.createLink === "function");
  assert(typeof linkService.getLink === "function");
  assert(typeof linkService.incrementClicks === "function");
  assert(typeof linkService.deleteLink === "function");
  assert(typeof linkService.updateLinkId === "function");
  assert(typeof linkService.updateLinkUrl === "function");
  assert(typeof linkService.getAllLinks === "function");
});
