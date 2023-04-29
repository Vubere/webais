import { Component } from "react";


type ErrorboundaryProps = {
  children: JSX.Element
}
type ErrorboundaryState = {
  hasError: boolean
}

export default class Errorboundary extends Component<ErrorboundaryProps, ErrorboundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true };
  }
  componentDidCatch(err: any, errInfo: any) {
  }
  render() {
    if (this.state.hasError) {
      return <>
        <div className="w-full h-[90vh] ">
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-[300px] h-[300px] flex flex-col justify-center items-center">
              <h1 className="text-[#347836] text-[28px] font-[600]">Something went wrong</h1>
              <p className="text-center">Please refresh the page or contact the admin</p>
              <div onClick={() =>{
                history.back()
                setTimeout(()=>{
                  window.location.reload()
                },500)
                }} className="w-[140px] text-[#347836] text-center border border-[#346837] h-[30px] cursor-pointer pointer">Go Back</div>
              <div onClick={() => window.location.reload()} className="w-[140px] text-[#346837] text-center border border-[#346837] h-[30px] cursor-pointer pointer">Reload Page</div>
            </div>
          </div>
        </div>
      </>
    }
    return this.props.children
  }
}