import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import PageLayout from "../../layouts/PageLayout";

export default class Index extends Component<PropsWithChildren> {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <PageLayout statusBarProps={{title: '首页'}}>
        <Text>Hello world!</Text>
      </PageLayout>
    )
  }
}
