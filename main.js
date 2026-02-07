"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/@jsquash/oxipng/meta.js
var defaultOptions;
var init_meta = __esm({
  "node_modules/@jsquash/oxipng/meta.js"() {
    defaultOptions = {
      level: 2,
      interlace: false,
      optimiseAlpha: false
    };
  }
});

// node_modules/wasm-feature-detect/dist/esm/index.js
var threads;
var init_esm = __esm({
  "node_modules/wasm-feature-detect/dist/esm/index.js"() {
    threads = () => (async (e) => {
      try {
        return "undefined" != typeof MessageChannel && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e);
      } catch (e2) {
        return false;
      }
    })(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
  }
});

// node_modules/@jsquash/oxipng/codec/pkg-parallel/snippets/wasm-bindgen-rayon-3e04391371ad0a8e/src/workerHelpers.js
async function startWorkers(module2, memory, builder) {
  if (builder.numThreads() === 0) {
    throw new Error(`num_threads must be > 0.`);
  }
  const workerInit = {
    module: module2,
    memory,
    receiver: builder.receiver()
  };
  _workers = await Promise.all(
    Array.from({ length: builder.numThreads() }, async () => {
      const worker = new Worker(
        new URL("./workerHelpers.worker.js", import_meta.url),
        {
          type: "module"
        }
      );
      worker.postMessage(workerInit);
      await new Promise(
        (resolve) => worker.addEventListener("message", resolve, { once: true })
      );
      return worker;
    })
  );
  builder.build();
}
var import_meta, _workers;
var init_workerHelpers = __esm({
  "node_modules/@jsquash/oxipng/codec/pkg-parallel/snippets/wasm-bindgen-rayon-3e04391371ad0a8e/src/workerHelpers.js"() {
    import_meta = {};
  }
});

// node_modules/@jsquash/oxipng/codec/pkg-parallel/squoosh_oxipng.js
var squoosh_oxipng_exports = {};
__export(squoosh_oxipng_exports, {
  default: () => squoosh_oxipng_default,
  initSync: () => initSync,
  initThreadPool: () => initThreadPool,
  optimise: () => optimise,
  optimise_raw: () => optimise_raw,
  wbg_rayon_PoolBuilder: () => wbg_rayon_PoolBuilder,
  wbg_rayon_start_worker: () => wbg_rayon_start_worker
});
function getObject(idx) {
  return heap[idx];
}
function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.buffer !== wasm.memory.buffer) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
}
function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.buffer !== wasm.memory.buffer) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function optimise(data, level, interlace, optimize_alpha) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.optimise(retptr, ptr0, len0, level, interlace, optimize_alpha);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
function optimise_raw(data, width, height, level, interlace, optimize_alpha) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.optimise_raw(retptr, ptr0, len0, width, height, level, interlace, optimize_alpha);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}
function initThreadPool(num_threads) {
  const ret = wasm.initThreadPool(num_threads);
  return takeObject(ret);
}
function wbg_rayon_start_worker(receiver) {
  wasm.wbg_rayon_start_worker(receiver);
}
async function __wbg_load(module2, imports) {
  if (typeof Response === "function" && module2 instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module2, imports);
      } catch (e) {
        if (module2.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module2.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module2, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module: module2 };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() {
    return handleError(function() {
      const ret = self.self;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_window_c6fb939a7f436783 = function() {
    return handleError(function() {
      const ret = window.window;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() {
    return handleError(function() {
      const ret = globalThis.globalThis;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_global_207b558942527489 = function() {
    return handleError(function() {
      const ret = global.global;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === void 0;
    return ret;
  };
  imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_call_27c0f87801dedf93 = function() {
    return handleError(function(arg0, arg1) {
      const ret = getObject(arg0).call(getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_module = function() {
    const ret = __wbg_init.__wbindgen_wasm_module;
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_startWorkers_2ee336a9694dda13 = function(arg0, arg1, arg2) {
    const ret = startWorkers(takeObject(arg0), takeObject(arg1), wbg_rayon_PoolBuilder.__wrap(arg2));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_instanceof_Window_f401953a2cf86220 = function(arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof Window;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  return imports;
}
function __wbg_init_memory(imports, maybe_memory) {
  imports.wbg.memory = maybe_memory || new WebAssembly.Memory({ initial: 18, maximum: 16384, shared: true });
}
function __wbg_finalize_init(instance, module2) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module2;
  cachedInt32Memory0 = null;
  cachedUint8Memory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
function initSync(module2, maybe_memory) {
  if (wasm !== void 0) return wasm;
  const imports = __wbg_get_imports();
  __wbg_init_memory(imports, maybe_memory);
  if (!(module2 instanceof WebAssembly.Module)) {
    module2 = new WebAssembly.Module(module2);
  }
  const instance = new WebAssembly.Instance(module2, imports);
  return __wbg_finalize_init(instance, module2);
}
async function __wbg_init(input, maybe_memory) {
  if (wasm !== void 0) return wasm;
  if (typeof input === "undefined") {
    input = new URL("squoosh_oxipng_bg.wasm", import_meta2.url);
  }
  const imports = __wbg_get_imports();
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  __wbg_init_memory(imports, maybe_memory);
  const { instance, module: module2 } = await __wbg_load(await input, imports);
  return __wbg_finalize_init(instance, module2);
}
var import_meta2, wasm, heap, heap_next, cachedTextDecoder, cachedUint8Memory0, WASM_VECTOR_LEN, cachedInt32Memory0, wbg_rayon_PoolBuilderFinalization, wbg_rayon_PoolBuilder, squoosh_oxipng_default, isServiceWorker, isRunningInCloudFlareWorkers, isRunningInNode;
var init_squoosh_oxipng = __esm({
  "node_modules/@jsquash/oxipng/codec/pkg-parallel/squoosh_oxipng.js"() {
    init_workerHelpers();
    import_meta2 = {};
    heap = new Array(128).fill(void 0);
    heap.push(void 0, null, true, false);
    heap_next = heap.length;
    cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
      throw Error("TextDecoder not available");
    } };
    if (typeof TextDecoder !== "undefined") {
      cachedTextDecoder.decode();
    }
    cachedUint8Memory0 = null;
    WASM_VECTOR_LEN = 0;
    cachedInt32Memory0 = null;
    wbg_rayon_PoolBuilderFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
    }, unregister: () => {
    } } : new FinalizationRegistry((ptr) => wasm.__wbg_wbg_rayon_poolbuilder_free(ptr >>> 0));
    wbg_rayon_PoolBuilder = class _wbg_rayon_PoolBuilder {
      static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(_wbg_rayon_PoolBuilder.prototype);
        obj.__wbg_ptr = ptr;
        wbg_rayon_PoolBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        wbg_rayon_PoolBuilderFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wbg_rayon_poolbuilder_free(ptr);
      }
      /**
      * @returns {number}
      */
      numThreads() {
        const ret = wasm.wbg_rayon_poolbuilder_numThreads(this.__wbg_ptr);
        return ret >>> 0;
      }
      /**
      * @returns {number}
      */
      receiver() {
        const ret = wasm.wbg_rayon_poolbuilder_receiver(this.__wbg_ptr);
        return ret >>> 0;
      }
      /**
      */
      build() {
        wasm.wbg_rayon_poolbuilder_build(this.__wbg_ptr);
      }
    };
    squoosh_oxipng_default = __wbg_init;
    isServiceWorker = globalThis.ServiceWorkerGlobalScope !== void 0;
    isRunningInCloudFlareWorkers = isServiceWorker && typeof self !== "undefined" && globalThis.caches && globalThis.caches.default !== void 0;
    isRunningInNode = typeof process === "object" && process.release && process.release.name === "node";
    if (isRunningInCloudFlareWorkers || isRunningInNode) {
      if (!globalThis.ImageData) {
        globalThis.ImageData = class ImageData {
          constructor(data, width, height) {
            this.data = data;
            this.width = width;
            this.height = height;
          }
        };
      }
      if (import_meta2.url === void 0) {
        import_meta2.url = "https://localhost";
      }
      if (typeof self !== "undefined" && self.location === void 0) {
        self.location = { href: "" };
      }
    }
  }
});

// node_modules/@jsquash/oxipng/codec/pkg/squoosh_oxipng.js
var squoosh_oxipng_exports2 = {};
__export(squoosh_oxipng_exports2, {
  default: () => squoosh_oxipng_default2,
  initSync: () => initSync2,
  optimise: () => optimise2,
  optimise_raw: () => optimise_raw2
});
function getUint8Memory02() {
  if (cachedUint8Memory02 === null || cachedUint8Memory02.byteLength === 0) {
    cachedUint8Memory02 = new Uint8Array(wasm2.memory.buffer);
  }
  return cachedUint8Memory02;
}
function getStringFromWasm02(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder2.decode(getUint8Memory02().subarray(ptr, ptr + len));
}
function passArray8ToWasm02(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8Memory02().set(arg, ptr / 1);
  WASM_VECTOR_LEN2 = arg.length;
  return ptr;
}
function getInt32Memory02() {
  if (cachedInt32Memory02 === null || cachedInt32Memory02.byteLength === 0) {
    cachedInt32Memory02 = new Int32Array(wasm2.memory.buffer);
  }
  return cachedInt32Memory02;
}
function getArrayU8FromWasm02(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory02().subarray(ptr / 1, ptr / 1 + len);
}
function optimise2(data, level, interlace, optimize_alpha) {
  try {
    const retptr = wasm2.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm02(data, wasm2.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN2;
    wasm2.optimise(retptr, ptr0, len0, level, interlace, optimize_alpha);
    var r0 = getInt32Memory02()[retptr / 4 + 0];
    var r1 = getInt32Memory02()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm02(r0, r1).slice();
    wasm2.__wbindgen_free(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm2.__wbindgen_add_to_stack_pointer(16);
  }
}
function optimise_raw2(data, width, height, level, interlace, optimize_alpha) {
  try {
    const retptr = wasm2.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm02(data, wasm2.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN2;
    wasm2.optimise_raw(retptr, ptr0, len0, width, height, level, interlace, optimize_alpha);
    var r0 = getInt32Memory02()[retptr / 4 + 0];
    var r1 = getInt32Memory02()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm02(r0, r1).slice();
    wasm2.__wbindgen_free(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm2.__wbindgen_add_to_stack_pointer(16);
  }
}
async function __wbg_load2(module2, imports) {
  if (typeof Response === "function" && module2 instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module2, imports);
      } catch (e) {
        if (module2.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module2.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module2, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module: module2 };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports2() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm02(arg0, arg1));
  };
  return imports;
}
function __wbg_init_memory2(imports, maybe_memory) {
}
function __wbg_finalize_init2(instance, module2) {
  wasm2 = instance.exports;
  __wbg_init2.__wbindgen_wasm_module = module2;
  cachedInt32Memory02 = null;
  cachedUint8Memory02 = null;
  return wasm2;
}
function initSync2(module2) {
  if (wasm2 !== void 0) return wasm2;
  const imports = __wbg_get_imports2();
  __wbg_init_memory2(imports);
  if (!(module2 instanceof WebAssembly.Module)) {
    module2 = new WebAssembly.Module(module2);
  }
  const instance = new WebAssembly.Instance(module2, imports);
  return __wbg_finalize_init2(instance, module2);
}
async function __wbg_init2(input) {
  if (wasm2 !== void 0) return wasm2;
  if (typeof input === "undefined") {
    input = new URL("squoosh_oxipng_bg.wasm", import_meta3.url);
  }
  const imports = __wbg_get_imports2();
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  __wbg_init_memory2(imports);
  const { instance, module: module2 } = await __wbg_load2(await input, imports);
  return __wbg_finalize_init2(instance, module2);
}
var import_meta3, wasm2, cachedTextDecoder2, cachedUint8Memory02, WASM_VECTOR_LEN2, cachedInt32Memory02, squoosh_oxipng_default2, isServiceWorker2, isRunningInCloudFlareWorkers2, isRunningInNode2;
var init_squoosh_oxipng2 = __esm({
  "node_modules/@jsquash/oxipng/codec/pkg/squoosh_oxipng.js"() {
    import_meta3 = {};
    cachedTextDecoder2 = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
      throw Error("TextDecoder not available");
    } };
    if (typeof TextDecoder !== "undefined") {
      cachedTextDecoder2.decode();
    }
    cachedUint8Memory02 = null;
    WASM_VECTOR_LEN2 = 0;
    cachedInt32Memory02 = null;
    squoosh_oxipng_default2 = __wbg_init2;
    isServiceWorker2 = globalThis.ServiceWorkerGlobalScope !== void 0;
    isRunningInCloudFlareWorkers2 = isServiceWorker2 && typeof self !== "undefined" && globalThis.caches && globalThis.caches.default !== void 0;
    isRunningInNode2 = typeof process === "object" && process.release && process.release.name === "node";
    if (isRunningInCloudFlareWorkers2 || isRunningInNode2) {
      if (!globalThis.ImageData) {
        globalThis.ImageData = class ImageData {
          constructor(data, width, height) {
            this.data = data;
            this.width = width;
            this.height = height;
          }
        };
      }
      if (import_meta3.url === void 0) {
        import_meta3.url = "https://localhost";
      }
      if (typeof self !== "undefined" && self.location === void 0) {
        self.location = { href: "" };
      }
    }
  }
});

// node_modules/@jsquash/oxipng/optimise.js
async function initMT(moduleOrPath) {
  const { default: init2, initThreadPool: initThreadPool2, optimise: optimise4, optimise_raw: optimise_raw3 } = await Promise.resolve().then(() => (init_squoosh_oxipng(), squoosh_oxipng_exports));
  await init2(moduleOrPath);
  await initThreadPool2(globalThis.navigator.hardwareConcurrency);
  return { optimise: optimise4, optimise_raw: optimise_raw3 };
}
async function initST(moduleOrPath) {
  const { default: init2, optimise: optimise4, optimise_raw: optimise_raw3 } = await Promise.resolve().then(() => (init_squoosh_oxipng2(), squoosh_oxipng_exports2));
  await init2(moduleOrPath);
  return { optimise: optimise4, optimise_raw: optimise_raw3 };
}
async function init(moduleOrPath) {
  var _a;
  if (!wasmReady) {
    const hasHardwareConcurrency = ((_a = globalThis.navigator) === null || _a === void 0 ? void 0 : _a.hardwareConcurrency) > 1;
    const isWorker = typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
    if (isWorker && hasHardwareConcurrency && await threads()) {
      wasmReady = initMT(moduleOrPath);
    } else {
      wasmReady = initST(moduleOrPath);
    }
  }
  return wasmReady;
}
async function optimise3(data, options = {}) {
  const _options = { ...defaultOptions, ...options };
  const { optimise: optimise4, optimise_raw: optimise_raw3 } = await init();
  if (data instanceof ImageData) {
    return optimise_raw3(data.data, data.width, data.height, _options.level, _options.interlace, _options.optimiseAlpha).buffer;
  }
  return optimise4(new Uint8Array(data), _options.level, _options.interlace, _options.optimiseAlpha).buffer;
}
var wasmReady;
var init_optimise = __esm({
  "node_modules/@jsquash/oxipng/optimise.js"() {
    init_meta();
    init_esm();
  }
});

// node_modules/@jsquash/oxipng/index.js
var oxipng_exports = {};
__export(oxipng_exports, {
  optimise: () => optimise3
});
var init_oxipng = __esm({
  "node_modules/@jsquash/oxipng/index.js"() {
    init_optimise();
  }
});

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PasteRenamePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/compress.ts
var LosslessPngCompressor = class {
  supports(mime, ext) {
    return mime.toLowerCase() === "image/png" || ext.toLowerCase() === "png";
  }
  async compress(input, mime, ext) {
    if (!this.supports(mime, ext)) {
      return input;
    }
    try {
      const module2 = await Promise.resolve().then(() => (init_oxipng(), oxipng_exports));
      const optimized = await module2.optimise(input);
      return optimized.byteLength < input.byteLength ? optimized : input;
    } catch {
      return input;
    }
  }
};
function createDefaultCompressor() {
  return new LosslessPngCompressor();
}

// src/events.ts
var import_obsidian3 = require("obsidian");

// src/path.ts
var import_obsidian = require("obsidian");
var ILLEGAL_FILE_CHARS = /[<>:"/\\|?*]/g;
var MIME_EXTENSION_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "text/markdown": "md",
  "application/json": "json",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip"
};
function sanitizeFileNamePart(value) {
  const withoutControlChars = stripControlChars(value);
  const cleaned = withoutControlChars.replace(ILLEGAL_FILE_CHARS, "-").replace(/\s+/g, " ").trim().replace(/[. ]+$/g, "");
  return cleaned.length > 0 ? cleaned : "untitled";
}
function getNoteBaseName(fileName) {
  if (!fileName) {
    return "Untitled";
  }
  const normalized = fileName.replace(/\\/g, "/");
  const justName = normalized.split("/").pop() ?? normalized;
  const lastDot = justName.lastIndexOf(".");
  const baseName = lastDot > 0 ? justName.slice(0, lastDot) : justName;
  return sanitizeFileNamePart(baseName);
}
function resolveFileExtension(file) {
  const fromName = extensionFromName(file.name);
  if (fromName) {
    return fromName;
  }
  const fromMime = MIME_EXTENSION_MAP[file.type.toLowerCase()];
  if (fromMime) {
    return fromMime;
  }
  return "bin";
}
function buildFileName(baseName, extension) {
  const safeBase = sanitizeFileNamePart(baseName);
  const safeExt = sanitizeExtension(extension);
  return `${safeBase}.${safeExt}`;
}
function joinVaultPath(...parts) {
  const joined = parts.map((part) => part.trim()).filter(Boolean).map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
  return (0, import_obsidian.normalizePath)(joined);
}
function extensionFromName(fileName) {
  const name = fileName.trim();
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) {
    return null;
  }
  const ext = name.slice(lastDot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext.length > 0 ? ext : null;
}
function sanitizeExtension(extension) {
  const normalized = extension.replace(/^\.+/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized || "bin";
}
function stripControlChars(value) {
  let result = "";
  for (const char of value) {
    const code = char.charCodeAt(0);
    result += code <= 31 ? "-" : char;
  }
  return result;
}

// src/writeback.ts
var import_obsidian2 = require("obsidian");
function buildReferenceLink(app, vaultPath, isImage) {
  const normalized = (0, import_obsidian2.normalizePath)(vaultPath);
  if (shouldUseWikilinks(app)) {
    return isImage ? `![[${normalized}]]` : `[[${normalized}]]`;
  }
  const target = `<${normalized}>`;
  if (isImage) {
    return `![](${target})`;
  }
  const name = normalized.split("/").pop() ?? normalized;
  return `[${name}](${target})`;
}
function writeLinksAtCursor(editor, links) {
  if (links.length === 0) {
    return;
  }
  editor.replaceSelection(links.join("\n"));
}
function shouldUseWikilinks(app) {
  const vault = app.vault;
  const useMarkdownLinks = vault.getConfig?.("useMarkdownLinks");
  if (typeof useMarkdownLinks === "boolean") {
    return !useMarkdownLinks;
  }
  const useWikilinks = vault.getConfig?.("useWikilinks");
  if (typeof useWikilinks === "boolean") {
    return useWikilinks;
  }
  return true;
}

// src/events.ts
var PasteDropController = class {
  constructor(app, settingsProvider, storage) {
    this.app = app;
    this.settingsProvider = settingsProvider;
    this.storage = storage;
  }
  register(plugin) {
    const captureOptions = { capture: true };
    plugin.registerDomEvent(
      document,
      "paste",
      (evt) => {
        void this.onPaste(evt);
      },
      captureOptions
    );
    plugin.registerDomEvent(
      document,
      "drop",
      (evt) => {
        void this.onDrop(evt);
      },
      captureOptions
    );
  }
  async onPaste(event) {
    const files = extractFilesFromClipboard(event);
    if (files.length === 0) {
      return;
    }
    await this.processFiles(event, files);
  }
  async onDrop(event) {
    const files = extractFilesFromDrop(event);
    if (files.length === 0) {
      return;
    }
    await this.processFiles(event, files);
  }
  async processFiles(event, files) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
    if (!shouldIntercept(this.settingsProvider(), view)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const noteBaseName = getNoteBaseName(view.file?.name);
    const successes = [];
    const failures = [];
    for (const file of files) {
      try {
        const saved = await this.storage.saveFile(file, noteBaseName);
        successes.push(saved);
      } catch (error) {
        failures.push({
          fileName: file.name || "unnamed",
          reason: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    if (successes.length > 0) {
      writeLinksAtCursor(
        view.editor,
        successes.map((result) => result.linkText)
      );
    }
    if (failures.length > 0) {
      this.showFailureNotice(successes.length, failures);
    }
  }
  showFailureNotice(successCount, failures) {
    if (successCount === 0) {
      const message = formatFailureReasons(failures);
      new import_obsidian3.Notice(`Paste Rename: failed to save all files. ${message}`);
      return;
    }
    new import_obsidian3.Notice(`Paste Rename: saved ${successCount} file(s), failed ${failures.length}. ${formatFailureReasons(failures)}`);
  }
};
function shouldIntercept(settings, view) {
  return settings.interceptScope === "markdown-only" && !!view?.editor;
}
function extractFilesFromClipboard(event) {
  const files = Array.from(event.clipboardData?.files ?? []);
  if (files.length > 0) {
    return files;
  }
  const fromItems = [];
  const items = Array.from(event.clipboardData?.items ?? []);
  for (const item of items) {
    if (item.kind !== "file") {
      continue;
    }
    const file = item.getAsFile();
    if (file) {
      fromItems.push(file);
    }
  }
  return fromItems;
}
function extractFilesFromDrop(event) {
  return Array.from(event.dataTransfer?.files ?? []);
}
function formatFailureReasons(failures) {
  return failures.slice(0, 3).map((failure) => `${failure.fileName}: ${failure.reason}`).join(" | ");
}

// src/settings.ts
var import_obsidian4 = require("obsidian");

// src/template.ts
var TOKEN_REGEX = /{{\s*([A-Za-z]+(?::\d+)?)\s*}}/g;
var ALLOWED_LITERAL_TOKENS = /* @__PURE__ */ new Set(["YYYY", "YY", "MM", "DD", "HH", "mm", "ss", "FILENAME", "UUID"]);
function hasUniqueToken(template) {
  return /{{\s*(UUID|HASH:\d+)\s*}}/.test(template);
}
function validateTemplate(template, label) {
  if (!template.trim()) {
    throw new Error(`${label} must not be empty.`);
  }
  TOKEN_REGEX.lastIndex = 0;
  const hasWellFormedToken = TOKEN_REGEX.test(template);
  TOKEN_REGEX.lastIndex = 0;
  const malformedOpening = template.includes("{{") && !hasWellFormedToken;
  let match;
  while ((match = TOKEN_REGEX.exec(template)) !== null) {
    validateToken(match[1], label);
  }
  TOKEN_REGEX.lastIndex = 0;
  const scrubbed = template.replace(TOKEN_REGEX, "");
  if (malformedOpening || scrubbed.includes("{{") || scrubbed.includes("}}")) {
    throw new Error(`${label} contains malformed template braces.`);
  }
}
function renderTemplate(template, context) {
  validateTemplate(template, "Template");
  return template.replace(TOKEN_REGEX, (_full, rawToken) => {
    const token = rawToken.trim();
    const hashMatch = /^HASH:(\d+)$/.exec(token);
    if (hashMatch) {
      const length = Number(hashMatch[1]);
      validateHashLength(length);
      return context.randomHex(length);
    }
    switch (token) {
      case "YYYY":
        return `${context.date.getFullYear()}`;
      case "YY":
        return `${context.date.getFullYear()}`.slice(-2);
      case "MM":
        return pad2(context.date.getMonth() + 1);
      case "DD":
        return pad2(context.date.getDate());
      case "HH":
        return pad2(context.date.getHours());
      case "mm":
        return pad2(context.date.getMinutes());
      case "ss":
        return pad2(context.date.getSeconds());
      case "FILENAME":
        return context.fileNameBase;
      case "UUID":
        return context.uuid;
      default:
        throw new Error(`Unknown template token: ${token}`);
    }
  });
}
function createTemplateContext(fileNameBase, date = /* @__PURE__ */ new Date()) {
  return {
    date,
    fileNameBase: sanitizeFileNamePart(fileNameBase),
    uuid: generateUuidV4(),
    randomHex: generateRandomHex
  };
}
function validateToken(token, label) {
  const hashMatch = /^HASH:(\d+)$/.exec(token);
  if (hashMatch) {
    validateHashLength(Number(hashMatch[1]));
    return;
  }
  if (!ALLOWED_LITERAL_TOKENS.has(token)) {
    throw new Error(`${label} contains unsupported token: ${token}`);
  }
}
function validateHashLength(length) {
  if (!Number.isInteger(length) || length < 1 || length > 64) {
    throw new Error("HASH length must be an integer between 1 and 64.");
  }
}
function generateUuidV4() {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }
  const bytes = getRandomBytes(16);
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = bytesToHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function generateRandomHex(length) {
  validateHashLength(length);
  const bytes = getRandomBytes(Math.ceil(length / 2));
  return bytesToHex(bytes).slice(0, length);
}
function getRandomBytes(length) {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.getRandomValues) {
    return cryptoObj.getRandomValues(new Uint8Array(length));
  }
  const fallback = new Uint8Array(length);
  for (let i = 0; i < fallback.length; i += 1) {
    fallback[i] = Math.floor(Math.random() * 256);
  }
  return fallback;
}
function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function pad2(value) {
  return value.toString().padStart(2, "0");
}

// src/settings.ts
var DEFAULT_SETTINGS = {
  assetPattern: "09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}",
  interceptScope: "markdown-only",
  fileScope: "all-files",
  dedupeMode: "regen-unique",
  writebackSyntax: "follow-app-setting",
  compressionEnabled: false,
  compressionMode: "lossless-only"
};
var LEGACY_DEFAULT_PATH_TEMPLATE = "09-Assets/{{YYYY}}-{{MM}}/";
var LEGACY_DEFAULT_NAME_TEMPLATE = "{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}";
function coerceSettings(partial) {
  const migratedPattern = migrateLegacyPattern(partial);
  return {
    ...DEFAULT_SETTINGS,
    assetPattern: migratedPattern ?? DEFAULT_SETTINGS.assetPattern,
    ...partial,
    interceptScope: "markdown-only",
    fileScope: "all-files",
    dedupeMode: "regen-unique",
    writebackSyntax: "follow-app-setting",
    compressionMode: "lossless-only"
  };
}
function validateSettings(settings) {
  validateTemplate(settings.assetPattern, "Asset pattern");
  validateAssetPatternShape(settings.assetPattern);
}
var PasteRenameSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const pageHeading = new import_obsidian4.Setting(containerEl).setName("Paste rename").setHeading();
    pageHeading.settingEl.addClass("paste-rename-page-heading");
    this.addPatternSetting(containerEl);
    this.addCompressionSetting(containerEl);
  }
  addPatternSetting(containerEl) {
    const guide = containerEl.createDiv({ cls: "paste-rename-setting-guide" });
    const guideHeading = new import_obsidian4.Setting(guide).setName("Asset pattern").setHeading();
    guideHeading.settingEl.addClass("paste-rename-guide-heading");
    guide.createEl("p", { text: "Single pattern for folder + filename generation. Extension is appended automatically." });
    guide.createEl("p", { text: "Available variables:" });
    const list = guide.createEl("ul");
    list.createEl("li", { text: "{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}}: current local time." });
    list.createEl("li", { text: "{{FILENAME}}: active note name without .md, sanitized." });
    list.createEl("li", { text: "{{UUID}}: random v4 UUID." });
    list.createEl("li", { text: "{{HASH:n}}: random lowercase hex, n is 1..64." });
    guide.createEl("p", {
      cls: "paste-rename-setting-example",
      text: "Example: 09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}"
    });
    const pastedPreview = guide.createDiv({ cls: "paste-rename-setting-preview" });
    pastedPreview.createEl("p", { cls: "paste-rename-setting-preview-title", text: "Image paste preview" });
    const previewPathEl = pastedPreview.createEl("p", { cls: "paste-rename-setting-preview-code" });
    const previewLinkEl = pastedPreview.createEl("p", { cls: "paste-rename-setting-preview-code" });
    const updatePreview = (pattern) => {
      try {
        validateTemplate(pattern, "Asset pattern");
        validateAssetPatternShape(pattern);
        const samplePath = buildImagePastePreviewPath(pattern);
        const sampleLink = shouldUseWikilinks2(this.app) ? `![[${samplePath}]]` : `![](<${samplePath}>)`;
        previewPathEl.setText(`Saved as: ${samplePath}`);
        previewLinkEl.setText(`Inserted link: ${sampleLink}`);
      } catch {
        previewPathEl.setText("Saved as: (invalid pattern)");
        previewLinkEl.setText("Inserted link: (invalid pattern)");
      }
    };
    updatePreview(this.plugin.settings.assetPattern);
    const errorEl = containerEl.createDiv({ cls: "paste-rename-setting-error" });
    const setting = new import_obsidian4.Setting(containerEl).setName("Pattern").setDesc("One template contains both path and filename.");
    setting.settingEl.addClass("paste-rename-pattern-setting");
    setting.addText((text) => {
      text.setValue(this.plugin.settings.assetPattern);
      text.inputEl.setAttribute("placeholder", DEFAULT_SETTINGS.assetPattern);
      text.onChange(async (value) => {
        updatePreview(value);
        await this.persistValidatedText(
          text,
          errorEl,
          value,
          (next) => {
            validateTemplate(next, "Asset pattern");
            validateAssetPatternShape(next);
          },
          { assetPattern: value }
        );
      });
    });
  }
  addCompressionSetting(containerEl) {
    new import_obsidian4.Setting(containerEl).setName("Enable lossless PNG compression").setDesc("Default off. When enabled, PNG files are optimized with oxipng wasm if output is smaller.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.compressionEnabled);
      toggle.onChange(async (value) => {
        await this.plugin.updateSettings({ compressionEnabled: value });
      });
    });
  }
  async persistValidatedText(text, errorEl, nextValue, validator, patch) {
    try {
      validator(nextValue);
      clearError(errorEl, text);
      await this.plugin.updateSettings(patch);
    } catch (error) {
      showError(errorEl, text, error instanceof Error ? error.message : "Invalid value");
    }
  }
};
function validateAssetPatternShape(pattern) {
  const normalized = pattern.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized) {
    throw new Error("Asset pattern must not be empty.");
  }
  const segments = normalized.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "..")) {
    throw new Error("Asset pattern must not contain '..' segments.");
  }
  const lastSegment = normalized.split("/").pop() ?? "";
  if (!lastSegment.trim()) {
    throw new Error("Asset pattern must include a file-name segment.");
  }
}
function migrateLegacyPattern(partial) {
  if (partial.assetPattern) {
    return partial.assetPattern;
  }
  if (!partial.pathTemplate && !partial.nameTemplate && !partial.pathPrefix) {
    return void 0;
  }
  const prefix = (partial.pathPrefix ?? "").trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const path = (partial.pathTemplate ?? LEGACY_DEFAULT_PATH_TEMPLATE).trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const name = (partial.nameTemplate ?? LEGACY_DEFAULT_NAME_TEMPLATE).trim().replace(/^\/+|\/+$/g, "");
  const merged = [prefix, path, name].filter(Boolean).join("/");
  return merged || DEFAULT_SETTINGS.assetPattern;
}
function clearError(errorEl, text) {
  errorEl.empty();
  text.inputEl.removeClass("is-invalid");
}
function showError(errorEl, text, message) {
  errorEl.setText(message);
  text.inputEl.addClass("is-invalid");
}
function buildImagePastePreviewPath(pattern) {
  const rendered = renderTemplate(pattern, {
    date: /* @__PURE__ */ new Date("2026-02-07T15:32:10"),
    fileNameBase: "\u6D4B\u8BD5\u6587\u4EF6",
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    randomHex: (length) => "c7c8d9e0f1a2b3c4".slice(0, length).padEnd(length, "0")
  });
  return `${rendered}.png`;
}
function shouldUseWikilinks2(app) {
  const vault = app.vault;
  const useMarkdownLinks = vault.getConfig?.("useMarkdownLinks");
  if (typeof useMarkdownLinks === "boolean") {
    return !useMarkdownLinks;
  }
  const useWikilinks = vault.getConfig?.("useWikilinks");
  if (typeof useWikilinks === "boolean") {
    return useWikilinks;
  }
  return true;
}

// src/storage.ts
var import_obsidian5 = require("obsidian");
var AssetStorage = class {
  constructor(app, settingsProvider, compressor) {
    this.app = app;
    this.settingsProvider = settingsProvider;
    this.compressor = compressor;
  }
  async saveFile(file, noteBaseName) {
    const settings = this.settingsProvider();
    const extension = resolveFileExtension(file);
    const rawBuffer = await file.arrayBuffer();
    const content = await this.maybeCompress(rawBuffer, file.type, extension, settings);
    const vaultPath = await resolveUniqueVaultPath({
      settings,
      noteBaseName,
      extension,
      exists: (path) => this.app.vault.adapter.exists(path)
    });
    await ensureFolderExists(this.app.vault, getParentFolderPath(vaultPath));
    await this.app.vault.createBinary(vaultPath, content);
    const isImage = isImageFile(file.type, extension);
    return {
      vaultPath,
      linkText: buildReferenceLink(this.app, vaultPath, isImage)
    };
  }
  async maybeCompress(input, mime, extension, settings) {
    if (!settings.compressionEnabled) {
      return input;
    }
    if (settings.compressionMode !== "lossless-only") {
      return input;
    }
    if (!this.compressor.supports(mime, extension)) {
      return input;
    }
    return this.compressor.compress(input, mime, extension);
  }
};
async function resolveUniqueVaultPath(input) {
  const hasExplicitUniqueToken = hasUniqueToken(input.settings.assetPattern);
  const maxAttempts = input.maxAttempts ?? 20;
  const now = input.now ?? (() => /* @__PURE__ */ new Date());
  const contextFactory = input.contextFactory ?? createTemplateContext;
  const fixedDate = now();
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const context = contextFactory(input.noteBaseName, fixedDate);
    const renderedPattern = renderTemplate(input.settings.assetPattern, context);
    const { directory, baseName } = splitRenderedPattern(renderedPattern);
    const deDupedName = attempt > 0 && !hasExplicitUniqueToken ? `${baseName}-${context.randomHex(8)}` : baseName;
    const filename = buildFileName(deDupedName, input.extension);
    const candidatePath = (0, import_obsidian5.normalizePath)(directory ? joinVaultPath(directory, filename) : filename);
    if (!await input.exists(candidatePath)) {
      return candidatePath;
    }
  }
  throw new Error(`Could not generate a unique filename in ${maxAttempts} attempts.`);
}
async function ensureFolderExists(vault, folderPath) {
  const normalized = (0, import_obsidian5.normalizePath)(folderPath).replace(/^\/+/, "");
  if (!normalized) {
    return;
  }
  const parts = normalized.split("/").filter(Boolean);
  let currentPath = "";
  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    if (!await vault.adapter.exists(currentPath)) {
      try {
        await vault.createFolder(currentPath);
      } catch (_error) {
        if (!await vault.adapter.exists(currentPath)) {
          throw _error;
        }
      }
    }
  }
}
function getParentFolderPath(path) {
  const idx = path.lastIndexOf("/");
  if (idx < 0) {
    return "";
  }
  return path.slice(0, idx);
}
function splitRenderedPattern(pattern) {
  const normalized = (0, import_obsidian5.normalizePath)(pattern.replace(/^\/+/, "").replace(/\/+$/, ""));
  if (!normalized) {
    throw new Error("Asset pattern produced an empty path.");
  }
  const index = normalized.lastIndexOf("/");
  if (index < 0) {
    return { directory: "", baseName: normalized };
  }
  const directory = normalized.slice(0, index);
  const baseName = normalized.slice(index + 1);
  if (!baseName.trim()) {
    throw new Error("Asset pattern must include a file-name segment.");
  }
  return { directory, baseName };
}
function isImageFile(mime, extension) {
  if (mime.toLowerCase().startsWith("image/")) {
    return true;
  }
  return ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tiff", "avif", "heic", "heif"].includes(
    extension.toLowerCase()
  );
}

// main.ts
var PasteRenamePlugin = class extends import_obsidian6.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings", DEFAULT_SETTINGS);
    __publicField(this, "storage");
    __publicField(this, "controller");
  }
  async onload() {
    await this.loadPluginSettings();
    this.storage = new AssetStorage(this.app, () => this.settings, createDefaultCompressor());
    this.controller = new PasteDropController(this.app, () => this.settings, this.storage);
    this.controller.register(this);
    this.addSettingTab(new PasteRenameSettingTab(this.app, this));
  }
  async updateSettings(patch) {
    const next = coerceSettings({ ...this.settings, ...patch });
    validateSettings(next);
    this.settings = next;
    await this.saveData(this.settings);
  }
  async loadPluginSettings() {
    const loaded = await this.loadData();
    const merged = coerceSettings({ ...DEFAULT_SETTINGS, ...loaded ?? {} });
    try {
      validateSettings(merged);
      this.settings = merged;
    } catch {
      this.settings = DEFAULT_SETTINGS;
      new import_obsidian6.Notice("Paste Rename: settings were invalid and have been reset to defaults.");
      await this.saveData(this.settings);
    }
  }
};
