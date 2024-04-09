import Link from "next/link";
import React from "react";

class ErrorBoundary extends React.Component<any, any> {
    constructor(props:any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error:any) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error:any, errorInfo:any) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <>
        <h1>Something went wrong.</h1>
        <p>Please Contact Elijah in the <Link href="https://discord.gg/ktTeZJsj47" target="_blank">discord server</Link> (PolarEyes) to report the issue.</p>
        </>
      }
  
      return this.props.children; 
    }
  }

export default ErrorBoundary;