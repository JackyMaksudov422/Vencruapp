import React from 'react';
import PlainCard from './PlainCard';
import { DateFilter } from "./Dropdown"
import { DoughnutChart } from './Charts';


const CustomOptionContent = ({fromTime, toTime}) => (
	<div className='filter-salts-summary-custom-option'>
		<span>{fromTime}</span>
		<span>{toTime}</span>
	</div>
);

const FILTER_OPTIONS = {
	'today': 'Today',
	'yesterday': 'Yesterday',
	'this-week': 'This Week',
	'this-month': 'This Month',
	'this-year': 'This Year',
	'custom': (
		<CustomOptionContent
			fromTime='mm/yy'
			toTime='mm/yy'
		/>
	),
};

export class DashboardCard extends React.Component{
    constructor(){
        super()
        this.state = { }
    }

    renderPlaceholder = () => {
        if (typeof this.props.renderPlaceholder === 'function'){
            return this.props.renderPlaceholder()
        }

        return (
            <PlainCard>
                <div className='placeholder-heading'>
                    <span className='placeholder-title'> {this.props.placeholderTitle || "Loading...."} </span>
                    <span className='placeholder-filters'>&nbsp;</span>
                </div>
                <div className='placeholder-graph'>
                    <div className='placeholder-graph-inner'>&nbsp;</div>
                </div>
                <div className='placeholder-bottom-line'></div>
            </PlainCard>
        )
    }

    renderRightInfo = () => {
        if (typeof this.props.renderRightInfo === 'function'){
            return this.props.renderRightInfo()
        }

        return (
            <React.Fragment>
                
                <span className="info-heading">Good Job!</span>
                <span className="info-text">
                    Your total revenue is X% higher than your average (N#,###). You had X orders this month. 
                    Shows how much money you have not received and how much of it is 
                    lateShows how much money you have not received and how much of it is
                    lateShows how much money you have not 
                </span>
            </React.Fragment>
        )        
    }

    renderBottom = () => {
        if (typeof this.props.renderBottom == 'function'){
            return this.props.renderBottom()
        }

        return (
            <div className='info-row row'>
                
                <div className='col-12 text'>
                    {this.renderRightInfo()}
                </div>
            </div>
        )
    }

    render(){
        const { cardTitle, placeholder, cardData } = this.props;        
        return (
            <div 
                className={`dashboard-card ${this.props.className || ''} ${placeholder ? 'placeholder-card' : '' }`}
            >
                <hr className='line-rule'/>
                <h2 className='title'> {cardTitle} </h2>
                { placeholder ?
                    this.renderPlaceholder() :
                     
                    <PlainCard>      
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className='heading'>
                                    <div className='title'>
                                        <span className="main-text">{`₦${cardData.amount}`}</span>
                                        <span className="sub-text">
                                            {cardData.subText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <span className='filters'>
                                    <DateFilter
                                        options={FILTER_OPTIONS}                                    
                                        variant='default'                                                                    
                                        classes={{
                                            toggler: 'summary-dropdown',
                                            list: 'summary-dd-list'
                                        }}
                                        selectedOption = {this.state.selectedOption}
                                        onChange={ (selectedOption) => { this.setState({ selectedOption : selectedOption }) } }
                                    />
                                </span>
                            </div>
                        </div>                                                                  

                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="graph">
                                    <DoughnutChart/>                            
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                {this.renderBottom()}
                            </div>
                        </div>                                                                    
                    </PlainCard>
                }
            </div>
        )
    }
}


export class SourcesCard extends React.Component {
    constructor(){
        super()
    }

    renderBar = (item, key) => {
        const { title, percentage, color } = item
        return (
            <div className="col-4" key={key}>
                <span className="bar-title"> {title} </span>
                <div className="bar-container">
                    <div style={{ width : `${percentage}%`, backgroundColor : color, height : "100%" }}>
                    </div>
                </div>
            </div>
        )
    }

    renderSources = () => {
        return (
            <React.Fragment>
                <span className="info-text">
                    Your total revenue is X% higher than your average (N#,###). You had X orders this month. Shows how much money you 
                </span>
                <a className="info-link" href="">For tips and tricks click this link</a>

                <div className="row sources-row">
                    {this.props.sources.map((item, index) => {
                        return this.renderBar(item, index)
                    })}
                </div>
            </React.Fragment>
        )
    }

    render(){
        return <DashboardCard 
        placeholder={this.props.placeholder}
        renderPlaceholder={this.props.renderPlaceholder} 
        renderRightInfo={this.renderSources}
        cardTitle = {this.props.cardTitle}
        cardData = {this.props.cardData}
        className = {this.props.className}
        renderBottom = {this.props.renderBottom}
        />
    }
}

export class SummaryCard extends React.Component {
    constructor(){
        super()
    }

    render(){        
        return(
            <div className="summary-card-container col-12 col-lg-4">
                <div className="row">
                    <div className="col-9">
                        <span className="title">{this.props.title}</span>
                        <span className="amount">{this.props.amount}</span>
                    </div>
                    <div className="col-3 img-container">
                        <img src={this.props.image}/>
                    </div>
                </div>
            </div>
        )
    }
}