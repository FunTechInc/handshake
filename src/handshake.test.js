import * as Handshake from "./handshake";
import { describe, it, beforeEach, expect } from "vitest";

beforeEach(() => {
   document.body.innerHTML = '<div id="container"></div>';
});

describe("Handshake", () => {
   it("should complete a handshake", async () => {
      await new Promise((resolve) => {
         new Handshake.Parent({
            container: "container",
            url: "http://localhost:63315/child.html",
         }).ready(({ revert }) => {
            revert();
            resolve();
         });
      });
   });

   it("should retrieve container and iframe", async () => {
      await new Promise((resolve, reject) => {
         new Handshake.Parent({
            container: "container",
            url: "http://localhost:63315/child.html",
         }).ready(({ container, iframe, revert }) => {
            try {
               expect(container).not.toBeNull();
               expect(iframe).not.toBeNull();
               expect(container).toBeInstanceOf(HTMLElement);
               expect(iframe).toBeInstanceOf(HTMLIFrameElement);
               revert();
               resolve();
            } catch (error) {
               revert();
               reject(error);
            }
         });
      });
   });

   it("should call a function in the child", async () => {
      await new Promise((resolve, reject) => {
         new Handshake.Parent({
            container: "container",
            url: "http://localhost:63315/child.html",
         }).ready(({ emit, on, revert }) => {
            emit("parentToChild", "parentToChild");
            on("childToParent", (value) => {
               try {
                  expect(value).toBe("Hello parent");
                  revert();
                  resolve();
               } catch (error) {
                  revert();
                  reject(error);
               }
            });
         });
      });
   });

   it("should revert listners in the child", async () => {
      await new Promise((resolve) => {
         new Handshake.Parent({
            container: "container",
            url: "http://localhost:63315/child.html",
         }).ready(({ emit, on, revert }) => {
            emit("revertTestCount");
            emit("revertTest");
            emit("revertTestCount");
            on("revertTestReturn", (count) => {
               expect(count).toBe(1);
               revert();
               resolve();
            });
         });
      });
   });
});
