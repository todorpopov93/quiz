import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const matchStates = ['home', 'away', 'both']

export default class LineChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      selectedTeams: [],
      matchState: 'both'
    }

    this.handleTeamSelect = this.handleTeamSelect.bind(this)
    this.handleMatchStateChange = this.handleMatchStateChange.bind(this)
  }

  componentDidMount() {
    const data = this.props.data.reduce((acc, item) => {
      const visitorTeamExists = acc.find(object => object.id === item['Visitor/Neutral'])
      const homeTeamExists = acc.find(object => object.id === item['Home/Neutral'])
      if (!visitorTeamExists) {
        acc.push({
          "id": item['Visitor/Neutral'],
          "color": "hsl(284, 70%, 50%)",
          "data": [
            {
              x: `${item['Date']} ${item['Start (ET)']}`,
              y: item['VPTS'],
              matchState: 'away'
            }
          ]
        })
      } else {
        acc = acc.map(object => {
          if (object.id === item['Visitor/Neutral']) {
            return {
              ...object,
              data: [
                ...object.data,
                {
                  x: `${item['Date']} ${item['Start (ET)']}`,
                  y: item['VPTS'],
                  matchState: 'away'
                }
              ]
            }
          }

          return object
        })
      }

      if (!homeTeamExists) {
        acc.push({
          "id": item['Home/Neutral'],
          "color": `hsl(${284}, 70%, 50%)`,
          "data": [
            {
              x: `${item['Date']} ${item['Start (ET)']}`,
              y: item['HPTS'],
              matchState: 'home'
            }
          ]
        })
      } else {
        acc = acc.map(object => {
          if (object.id === item['Home/Neutral']) {
            return {
              ...object,
              data: [
                ...object.data,
                {
                  x: `${item['Date']} ${item['Start (ET)']}`,
                  y: item['HPTS'],
                  matchState: 'home'
                }
              ]
            }
          }

          return object
        })
      }
      
      return acc
    }, [])

    this.setState({
      data
    })
  }

  handleTeamSelect (e) {
    this.setState({
      selectedTeams: e.target.value
    })
  }
  
  handleMatchStateChange (e) {
    this.setState({
      matchState: e.target.value
    })
  }

  render() {
    let { selectedTeams, data, matchState } = this.state

    // If there are any selected teams
    if (selectedTeams && selectedTeams.length > 0) {
      data = data.reduce((acc, item) => {
        const isSelected = selectedTeams.find(teamName => item.id === teamName)
        if (isSelected) {
          acc.push(item)
        }

        return acc
      }, [])
    }

    // If match state filter is applied (home/away)
    if (matchState !== 'both') {
      data = data.map(object => ({
        ...object,
        data: object.data.filter(dataItem => dataItem.matchState === matchState)
      }))
    }

    return (
      <div style={{
          width: '1200px',
          height: '800px'
      }}>
        <div style={{ 'display': 'flex', 'flex-direction': 'row' }}>
          <FormControl style={{ width: '300px'}}>
            <InputLabel htmlFor="select-multiple-chip">Select Teams</InputLabel>
            <Select
              multiple
              value={this.state.selectedTeams}
              onChange={this.handleTeamSelect}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div>
                  {selected.map(value => (
                    <Chip key={value} label={value}/>
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {this.state.data.map(item => (
                <MenuItem key={item.id} value={item.id} >
                  {item.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ width: '300px' }}>
            <InputLabel htmlFor="showPoints">Show points for</InputLabel>
              <Select
                value={this.state.matchState}
                onChange={this.handleMatchStateChange}
                input={<Input id="showPoints" />}
                MenuProps={MenuProps}
              >
              {matchStates.map(item => (
                <MenuItem key={item} value={item} >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <ResponsiveLine
          data={data}
          margin={{
              "top": 100,
              "right": 200,
              "bottom": 50,
              "left": 60
          }}
          xScale={{
              type: "time",
              format: '%m/%d/%y %H:%M:%S',
              precision: 'minute'
          }}
          yScale={{
              "type": "linear",
              "stacked": false,
              "min": "auto",
              "max": "auto"
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: '%m/%d/%y',
            tickValues: 6
          }}
          axisLeft={{
              "orient": "left",
              "tickSize": 1,
              "tickPadding": 1,
              "tickRotation": 0,
              "legend": "points",
              "legendOffset": -40,
              "legendPosition": "middle"
          }}
          dotSize={10}
          dotColor="inherit:darker(0.3)"
          dotBorderWidth={2}
          dotBorderColor="#ffffff"
          enableDotLabel={true}
          dotLabel="y"
          dotLabelYOffset={-12}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          legends={[
              {
                  "anchor": "bottom-right",
                  "direction": "column",
                  "justify": false,
                  "translateX": 100,
                  "translateY": 0,
                  "itemsSpacing": 0,
                  "itemDirection": "left-to-right",
                  "itemWidth": 80,
                  "itemHeight": 20,
                  "itemOpacity": 0.75,
                  "symbolSize": 12,
                  "symbolShape": "circle",
                  "symbolBorderColor": "rgba(0, 0, 0, .5)",
                  "effects": [
                      {
                          "on": "hover",
                          "style": {
                              "itemBackground": "rgba(0, 0, 0, .03)",
                              "itemOpacity": 1
                          }
                      }
                  ]
              }
          ]}
        />
      </div>
    )
  }
}
