import { createWasmGame } from "@/lib/wasm";
import wasmPath from "../../../../../wasm-imperator/pkg/wasm_imperator_bg.wasm";
import * as mod from "../../../../../wasm-imperator/pkg/wasm_imperator";
import tokenPath from "../../../../../../assets/tokens/imperator.bin";

export const wasm = createWasmGame<typeof mod, mod.SaveFile, typeof wasmPath>(
  mod,
  wasmPath,
  tokenPath,
);
