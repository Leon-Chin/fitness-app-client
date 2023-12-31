import React, { useEffect, useState } from 'react'
import { getconversation } from '../../../../api/user.api'
import Conversation from './conversation'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import './index.less'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'

export default function Conversations() {
    const intl = useIntl()
    const { currentUser } = useSelector(state => state.user)
    const [conversation, setConversation] = useState([])
    const navigateTo = useNavigate()
    const getConversations = async () => {
        try {
            const conversations = await getconversation()
            setConversation(conversations)
        } catch (error) {
            message.error(intl.formatMessage({id: 'error.cmty.failLoad'}))
        }
    }
    useEffect(() => {
        getConversations()
        // const intervalID = setInterval(getConversations, 3000);
        // return () => {
        //     clearInterval(intervalID)
        // }
    }, [])
    return (
        <div className='conversations'>
            {conversation?.map((conversation) => <div key={conversation._id} onClick={() => navigateTo(`/chat/conversations/specific/${conversation._id}`)}> <Conversation conversation={conversation} currentUserId={currentUser._id} /></div>)}
        </div>
    )
}
