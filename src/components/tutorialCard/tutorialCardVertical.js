import React, { useEffect, useRef, useState } from 'react'
import './tutorialCardVertical.less'
import { useSelector } from 'react-redux'
import { CalendarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
export default function TutorialCardVertical({ tutorial, calcWaterfall }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigateTo = useNavigate()
  const tutorialRef = useRef(null)
  const handleResize = () => {
    setWindowWidth(window.innerWidth); // 更新窗口宽度
    calcWaterfall(4, 10)
  };
  const MyDebounceFunc = (func, delay) => {
    let timeoutId;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  };
  useEffect(() => {
    // 添加窗口resize事件监听器，并在事件触发时调用防抖函数
    const debouncedResizeHandler = MyDebounceFunc(handleResize, 200); // 200毫秒的防抖延迟
    window.addEventListener('resize', debouncedResizeHandler);
    return () => {
      // 在组件卸载时，移除窗口resize事件监听器
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);
  useEffect(() => {
    console.log("tutorialRef.current?.offsetHeight", tutorialRef.current?.offsetHeight);
    calcWaterfall(4, 10)
  }, [tutorialRef.current?.offsetHeight])
  const { cover, level, colorie, brief, name, duration, _id } = tutorial
  const { currentTheme } = useSelector(state => state.user)
  const lightTutorialCardVerticalClassname = currentTheme === 'light' ? 'tutorialCardVertical-light' : ''
  const imgRef = useRef(null)
  return (
    <div ref={tutorialRef} onClick={() => { navigateTo(`/specifictutorial/${_id}`) }} className={`tutorialCardVertical ${lightTutorialCardVerticalClassname}`}>
      <div className='tutorialCardVertical-cover'>
        <img ref={imgRef} onLoad={() => calcWaterfall(4, 10)} src={cover} />
        <div className='tutorialCardVertical-cover-detail'>
          <div className='tutorialCardVertical-cover-detail-level'>{level}</div>
          <div className='tutorialCardVertical-cover-detail-duration'>{duration}分钟</div>
        </div>
      </div>
      <div className='tutorialCardVertical-bottom'>
        <div className={`tutorialCardVertical-bottom-desc`}>
          <div className='tutorialCardVertical-bottom-desc-title'>{name}</div>
          <div className='tutorialCardVertical-bottom-desc-brief'>{brief}</div>
        </div>
        <div className='TutorialCardHorizontal-bottom-extraBtn'>
          <CalendarFilled />
        </div>
      </div>
    </div >
  )
}
