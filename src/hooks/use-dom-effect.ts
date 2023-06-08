import { useEffect, useLayoutEffect } from "react";

const useDomEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default useDomEffect;