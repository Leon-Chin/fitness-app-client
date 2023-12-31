import { Button, Form, Input, Select, message, Upload, Radio } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { storage } from '../../../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux'
import CardTitle from '../../../components/CardTitle'
import { updateblog } from '../../../api/user.api';
import { useIntl } from 'react-intl';
const { TextArea } = Input;

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const options = (formatMessage) => [{ value: 'fit', label: formatMessage({id: 'app.blog.label.tag.fit'}) }, { value: 'eat', label: formatMessage({id: 'app.blog.label.tag.eat'}) }, { value: 'daily life', label: formatMessage({id: 'app.blog.label.tag.dailyLife'}) }];

export default function EditBlog({ selectedBlog, setModalOpen }) {
    const intl = useIntl()
    const [BlogID, setBlogID] = useState(selectedBlog._id)
    const formRef = React.useRef(null);
    const { currentTheme } = useSelector((state) => state.user)
    const [uploading, setUploading] = useState(false)
    const [blogType, setBlogType] = useState(selectedBlog.blogType)
    const [blogImgs, setBlogImgs] = useState(selectedBlog.imgUrl.map((item, index) => { return { uid: index, name: 'BlogImage', status: 'done', url: item, thumbUrl: item } }))
    const [blogVideo, setBlogVideo] = useState(selectedBlog?.blogType === 'video' ? [{ uid: 0, name: 'BlogImage', status: 'done', url: selectedBlog.videoUrl }] : [])
    const propsImage = {
        onRemove: (file) => {
            const index = blogImgs.indexOf(file);
            const newFileList = blogImgs.slice();
            newFileList.splice(index, 1);
            setBlogImgs(newFileList);
        },
        beforeUpload: (file) => {
            const isImage = file.type?.startsWith('image')
            if (isImage) {
                blogImgs.push({ ...file, name: file.name })
                console.log("first1", blogImgs);
                setBlogImgs(blogImgs)
            } else {
                message.error('u only can upload picture here')
                return false
            }
        },
        fileList: blogImgs,
    };
    const propsVideo = {
        onRemove: (file) => {
            const index = blogVideo.indexOf(file);
            const newFileList = blogVideo.slice();
            newFileList.splice(index, 1);
            setBlogVideo(newFileList);
        },
        beforeUpload: (file) => {
            console.log(file);
            const isVideo = file.type?.startsWith('video')
            if (isVideo) {
                setBlogVideo([{ ...file, name: file.name }])
            } else {
                message.error('u only can upload video here')
                return false
            }
        },
        fileList: blogVideo,
    };
    const submitImageToFirebase = ({ file }) => {
        setUploading(true)
        if (file) {
            const storageRef = ref(storage, `blog-Images-${parseInt((new Date().getTime() / 1000).toString())}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("first", blogImgs);
                const handledBlogImgs = blogImgs.map(item => {
                    if (item.uid === file.uid) {
                        return { ...file, status: 'uploading', percent: progress }
                    }
                    return item
                })
                setBlogImgs(handledBlogImgs)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running', progress);
                        break;
                }
            },
                (error) => {
                    message.err('Some error happens')
                    blogImgs.map(item => {
                        if (item.uid === file.uid) {
                            return { ...file, status: 'error' }
                        }
                        return item
                    })
                    setBlogImgs(blogImgs)
                    setUploading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const handledBlogImgs = blogImgs.map(item => {
                            if (item.uid === file.uid) {
                                return { ...file, status: 'done', url: downloadURL, thumbUrl: downloadURL, name: file.name }
                            }
                            return item
                        })
                        setBlogImgs(handledBlogImgs)
                    });
                    setUploading(false)
                }
            );
        } else {
            message.err('Some error happens')
            blogImgs.map(item => {
                if (item.uid === file.uid) {
                    return item = { ...file, status: 'error' }
                }
                return item
            })
            setBlogImgs(blogImgs)
            setUploading(false)
        }
    }
    const submitVideoToFirebase = ({ file }) => {
        setUploading(true)
        if (file) {
            const storageRef = ref(storage, `Tutorial-Video-${parseInt((new Date().getTime() / 1000).toString())}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setBlogVideo([{ ...file, status: 'uploading', percent: progress }])
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    message.err('Some error happens')
                    setBlogVideo([{ ...file, status: 'error' }])
                    setUploading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setBlogVideo([{ ...file, status: 'done', url: downloadURL, name: file.name }])
                    });
                    setUploading(false)
                }
            );
        } else {
            message.err('Some error happens')
            setBlogVideo([{ ...file, status: 'error' }])
            setUploading(false)
        }
    }
    const onFinish = async (items) => {
        let handledItems
        if (blogType) {
            console.log(blogType);
            if (blogType === 'picture') {
                const imgUrl = blogImgs.map(item => item.url)
                handledItems = { ...items, imgUrl, videoUrl: "" }
            } else if (blogType === 'video') {
                const videoUrl = blogVideo[0].url
                handledItems = { ...items, videoUrl, imgUrl: [] }
            } else {
                handledItems = { ...items, videoUrl: "", imgUrl: [] }
            }
        }
        try {
            await updateblog(BlogID, handledItems)
            message.success('update blog successfully')
            clear()
            window.location.reload()
            setModalOpen(false)
        } catch (error) {
            console.log(error);
            message.error('error')
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
        message.error('Failed:', errorInfo)
    };
    const clear = () => {
        formRef.current?.resetFields();
        setBlogImgs([])
    };
    const lightpostBox = currentTheme === 'light' ? 'postBox-light' : ''
    return (
        <div className='postBlog'>
            <CardTitle title={intl.formatMessage({id: 'app.blog.title.edit'})} />
            <div className={`postBox ${lightpostBox}`}>
                <Form initialValues={selectedBlog} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ width: '100%' }} onFinish={onFinish} ref={formRef} onFinishFailed={onFinishFailed}>
                    <Form.Item name="title" label={intl.formatMessage({id: 'app.blog.label.title'})} rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="content" label={intl.formatMessage({id: 'app.blog.label.content'})} rules={[{ required: true }]}><TextArea rows={3} /></Form.Item>
                    <Form.Item name="tags" label={intl.formatMessage({id: 'app.blog.label.tag'})} rules={[{ required: true }]}><Select mode="tags" style={{ width: '100%' }} placeholder={intl.formatMessage({id: 'app.blog.label.tag.tagMode'})} options={options(intl.formatMessage)} /></Form.Item>
                    <Form.Item name="blogType" label={intl.formatMessage({id: 'app.blog.label.type'})} rules={[{ required: true }]}>
                        <Radio.Group optionType="button" defaultValue={blogType} onChange={({ target: { value } }) => setBlogType(value)}><Radio value="text"> {intl.formatMessage({id: 'app.blog.label.type.text'})} </Radio><Radio value="picture"> {intl.formatMessage({id: 'app.blog.label.type.pic'})} </Radio><Radio value="video"> {intl.formatMessage({id: 'app.blog.label.type.video'})} </Radio></Radio.Group>
                    </Form.Item>
                    {blogType === 'picture' && <Form.Item label={intl.formatMessage({id: 'app.blog.label.pic'})} valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload name="image" listType="picture" customRequest={submitImageToFirebase} maxCount={9} {...propsImage}>
                            <Button icon={<UploadOutlined />}>{intl.formatMessage({id: 'btn.clickToUploadPic'})}</Button>
                        </Upload>
                    </Form.Item>}
                    {blogType === 'video' && <Form.Item label={intl.formatMessage({id: 'app.blog.label.vid'})} valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload name="video" customRequest={submitVideoToFirebase} maxCount={1} {...propsVideo}>
                            <Button icon={<UploadOutlined />}>{intl.formatMessage({id: 'btn.clickToUploadVid'})}</Button>
                        </Upload>
                    </Form.Item>}
                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}><Button type="primary" htmlType="submit" disabled={uploading ? true : false}>{intl.formatMessage({id: 'btn.save'})}</Button></Form.Item>
                </Form>
            </div>
        </div >
    )
}

