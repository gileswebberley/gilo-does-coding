const breakpoints = {
  xxs: '360px',
  xs: '480px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1440px',
  xxl: '1600px',
};

// Function to set breakpoints as CSS :root variables - oh bugger, you can't use these in media queries!
function setBreakpointsAsCSSVars(breakpoints) {
  const root = document.documentElement;
  Object.entries(breakpoints).forEach(([key, value]) => {
    root.style.setProperty(`--breakpoint-${key}`, value);
  });
}

// Apply the breakpoints
setBreakpointsAsCSSVars(breakpoints);

export default breakpoints;
