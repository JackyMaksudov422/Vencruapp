import React from 'react'
import { thousand } from '../../helpers/Misc';
import { PieChart, Pie, Sector } from 'recharts';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.currency}${thousand(parseInt(value))}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        </g>
    );
};

export default class ClientRevenueCard extends React.Component {
    state = {
        activeIndex: 0,
    };
    
    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };

    render(){
        const { outstandingRevenue, totalIncome, currency } = this.props
        let data = [
            { name: 'Received', value: totalIncome || 0, currency: currency },
            { name: 'Total Outstanding', value: outstandingRevenue || 0 , currency: currency}
        ];

        return (
            <div className="vc-plain-card client-revenue-card">
                <div className="row">
                    <div className="col-6 title">
                        Outstanding Revenue
                    </div>
                    <div className="col-6 price-container">
                        { currency || '$'}
                        {thousand(parseInt(outstandingRevenue)) || `0`}
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-offset-8">
                        <PieChart width={400} height={350}>
                            <Pie
                                activeIndex={this.state.activeIndex}
                                activeShape={renderActiveShape}
                                data={data}
                                cx={200}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={this.onPieEnter}
                                currency={currency || '$'}
                            />
                        </PieChart>
                    </div>
                </div>
            </div>
        )
    }
}