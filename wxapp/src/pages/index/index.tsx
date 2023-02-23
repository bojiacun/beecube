import { Component, PropsWithChildren } from 'react'
import './index.scss'
import DiyPage from "../../components/diy";

export default class Index extends Component<PropsWithChildren> {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <DiyPage pageIdentifier={'HOME'} />
    )
  }
}
