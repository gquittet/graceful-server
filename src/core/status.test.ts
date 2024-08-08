import { EventEmitter } from "events";
import { describe, expect, it, vi } from "vitest";
import State from "#core/state";
import Status from "#core/status";

describe("status", () => {
  it("should have a default state as STARTING", () => {
    expect.assertions(1);
    const eventEmitter = new EventEmitter();
    const status = Status(eventEmitter);

    const result = status.get();
    expect(result).toBe(State.STARTING);
  });

  it("should send an event when status change", () => {
    expect.assertions(1);
    const eventEmitter = new EventEmitter();
    const status = Status(eventEmitter);

    eventEmitter.on(State.READY, () => {
      const result = status.get();
      expect(result).toBe(State.READY);
    });

    status.setReady();
  });

  describe("get", () => {
    it("should return the current state", () => {
      expect.assertions(2);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      expect(status.get()).toBe(State.STARTING);
      status.setReady();
      expect(status.get()).toBe(State.READY);
    });
  });

  describe("isReady", () => {
    it("should return false when status is not ready", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      expect(status.isReady()).toBe(false);
    });
    it("should return true when status is ready", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      status.setReady();
      expect(status.isReady()).toBe(true);
    });
  });

  describe("setReady", () => {
    it("should call the set method", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      status.set = vi.fn();

      status.setReady();

      expect(status.set).toHaveBeenCalledTimes(1);
    });
    it("should change the status to ready", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      status.setReady();

      expect(status.get()).toBe(State.READY);
    });
    it("should return nothing", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      const result = status.setReady();

      expect(result).toBeUndefined();
    });
  });

  describe("set", () => {
    it("should change the status", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      status.set(State.SHUTTING_DOWN);
      expect(status.get()).toBe(State.SHUTTING_DOWN);
    });
    it("should return the status object", () => {
      expect.assertions(1);
      const eventEmitter = new EventEmitter();
      const status = Status(eventEmitter);

      const result = status.set(State.SHUTTING_DOWN);
      expect(result).toBe(status);
    });
  });
});
