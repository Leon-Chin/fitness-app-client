import React, { useState } from 'react'
import './index.less'
import { useIntl } from 'react-intl';
import useMeasurement from '../../hooks/useMeasurement';
import { isEmptyObj } from '../../utils/funcs';
import COLORS from '../../constants/COLORS';
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts'
import useMeasurements from '../../hooks/useMeasurements';
import { PlusOutlined } from '@ant-design/icons';
import APPTHEME from '../../constants/COLORS/APPTHEME';
import useUserTheme from '../../hooks/useUserTheme';
import { formatTimeToChineseDetail } from '../../utils/formatTime';
import { Empty } from 'antd';
import UploadMeasurementModal from '../MeasurementModals/uploadModal';
import matric from '../../Pic/matric.png'

export default function Index() {
    const currentTheme = useUserTheme()
    const THEME = APPTHEME[currentTheme]
    const { latestMeasurement, allMeasurements } = useMeasurement()
    const { weightArr, dateArr } = useMeasurements(allMeasurements)
    const WeightLineOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: COLORS.primary,
                },
            },
        },
        xAxis: {
            type: 'category',
            data: dateArr,
            show: false
        },
        yAxis: {
            type: 'value',
            min: Math.min(...weightArr) - 2,
            max: Math.max(...weightArr) + 2,
            show: false,
            splitLine: {
                show: false // Do not show the split lines
            },
        },
        grid: {
            top: -10,
        },
        series: [
            {
                data: weightArr,
                type: 'line',
                name: 'Weight',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [{
                            offset: 0, color: '#6C96E1' // 0% 处的颜色
                        }, {
                            offset: 1, color: THEME.contentColor// 100% 处的颜色
                        }]
                        ),  //背景渐变色 
                    },
                },
                smooth: true
            }
        ],
        backgroundColor: ''
    };
    const [UploadMeasurementModalVisible, setUploadMeasurementModalVisible] = useState()
    const intl = useIntl()
    return (
        <div className={"competition"}>
            <div className={`myCards`} style={{ backgroundColor: THEME.contentColor, padding: "10px 0" }}>
                <div style={{ fontSize: 16, padding: "4px 10px", fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <img src={matric} style={{ height: 24, width: 24 }}></img>
                        <div>{intl.formatMessage({ id: 'app.dsh.title.measurements' })}</div>
                    </div>
                    <div onClick={() => setUploadMeasurementModalVisible(true)}>
                        <PlusOutlined />
                    </div>
                </div>
                <div style={{ flex: 1, padding: '0 10px' }}>
                    {isEmptyObj(latestMeasurement) && <div
                        style={{ marginTop: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: COLORS.commentText, padding: 10, borderRadius: 16, backgroundColor: THEME.backgroundColor }}
                    >
                        <Empty description={false} />
                        {intl.formatMessage({ id: 'app.dsh.msg.noMeasurements' })}
                    </div>}
                    {!isEmptyObj(latestMeasurement) && <div>
                        <div>
                            <div style={{ fontSize: 12, color: COLORS.commentText }}>{intl.formatMessage({ id: 'app.dsh.title.wt' })}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                <div style={{ fontWeight: 'bold', fontSize: 18 }}>{latestMeasurement.weight}</div>
                                <div style={{ fontSize: 10 }}>{intl.formatMessage({ id: 'app.dsh.unit.wt' })}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 1, }}>
                                <div style={{ fontSize: 12, color: COLORS.commentText }}>BMI</div>
                                <div><div style={{ fontWeight: 'bold' }}>{latestMeasurement.BMI}</div></div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: COLORS.commentText }}>{intl.formatMessage({ id: 'app.dsh.title.bfr' })}</div>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}><div style={{ fontWeight: 'bold' }}>{latestMeasurement.bodyFatRate}</div><div style={{ fontSize: 10 }}>%</div></div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: COLORS.commentText }}>{intl.formatMessage({ id: 'app.dsh.title.ht' })}</div>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}><div style={{ fontWeight: 'bold' }}>{latestMeasurement.height}</div><div style={{ fontSize: 10 }}>{intl.formatMessage({ id: 'app.dsh.unit.ht' })}</div></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            <div style={{ fontSize: 10, color: COLORS.commentText }}>{intl.formatMessage({ id: 'app.dsh.recordSince' })} </div>
                            <div style={{ fontSize: 10, color: COLORS.commentText }}>{latestMeasurement?.updatedAt && formatTimeToChineseDetail(latestMeasurement.updatedAt)}</div>
                        </div>
                    </div>}
                </div>
                <div style={{ flex: 1, paddingLeft: 10 }}>
                    <ReactEcharts option={WeightLineOption} theme={'light'} />
                </div>
            </div>
            <UploadMeasurementModal visible={UploadMeasurementModalVisible} setVisible={setUploadMeasurementModalVisible} />
        </div>
    )
}
