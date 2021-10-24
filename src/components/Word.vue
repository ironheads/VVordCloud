<template>

</template>

<script>
export default {
    name: "Word",
    props:{
        wordContent: {
            type: String,
            default: 'default'
        },
        fontSize: {
            type: Number,
            default: 12
        },
        fontFamily: {
            type: String,
            default: 'Roboto'
        },
        ratation: {
            type: Number,
            default: 0,
        },
        position: {
            left:{
                type: Number,
                default: undefined
            },
            top: {
                type: Number,
                default: undefined
            }
        }
    },
    data: ()=> ({
        
    }),
    computed: {

    },
    methods: {

    },
    created() {

    }
    ,
    render() {
        
    }

}
</script>

