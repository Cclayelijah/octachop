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
        <div style={{textAlign: 'center'}}>
          <h1>Something went wrong.</h1>
          <p>Please let us know in the <Link style={{color: 'blueviolet'}} href="https://discord.gg/ktTeZJsj47" target="_blank">discord server</Link> what page you were on and what time the error occured. Thank you.</p>
        </div>
        </>
      }
  
      return this.props.children; 
    }
  }

export default ErrorBoundary;