import React from 'react'

import LessonPlansDirectories from '../components/LessonPlansDirectories'
import RequestsList from '../components/RequestsList'
import SimsDirectories from '../components/SimsDirectories'
import SideBar from '../components/SideBar'
import { Accounts } from 'meteor/accounts-base'
import SimContainer from '../components/SimContainer'


import { Grid, Header, Button, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
 
export default class Dashboard extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            node:null,
            modelOpen:false
        }
        
        this.renderOption.bind(this)

    }

    getNode(node) {
        this.setState({
            node
        })
    }

    renderOption() {

       const option = this.props.match.params.option

       switch(option) {
            case 'lessonplans':
                return <LessonPlansDirectories/>
            case 'requests':
                return <RequestsList/>
            case 'uploadsim':
                return <SimsDirectories getNode = {this.getNode.bind(this)} isPreview = {false}/>
       }
    }

    handleClose = () => this.setState({node:null})  

    render() {
        return(
            <div>
                <div style = {{padding:'1.6rem'}}>

                    <Modal                
                        style = {{overflow:'auto'}}
                        open={this.state.node}
                        onClose={this.handleClose}
                        size='tiny'            
                    >
                        <Modal.Header>Preview</Modal.Header>

                        <Modal.Content>
                            <Modal.Description>

                                    <SimContainer {...this.state.node}/>
                        
                                    <Button onClick = {this.handleClose}>
                                        Close
                                    </Button>
                
                            </Modal.Description>
                            
                        </Modal.Content>             

                    </Modal>
                </div>

                <Button onClick = {()=>{Accounts.logout()}}>Log out</Button>   
                <Grid columns={3} divided>
                    <Grid.Row>
                        <Grid.Column >
                            <SideBar/> 
                        </Grid.Column>
                        <Grid.Column >
                            {this.renderOption()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}



