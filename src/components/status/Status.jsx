import React from 'react'
import { Text, Progress } from '@chakra-ui/react'

const Status = ({audioIsLoading, status}) => {
  return (
    <div>
        <Text>
            {audioIsLoading
                ? `Calculating... ${status || 'uploading'}...`
                : "Your tone and enunciation analysis will appear here"
            }
        </Text>
        <Progress
          size="sm"
          width={500}
          isIndeterminate={audioIsLoading}
          colorScheme='green'
        />
    </div>
  )
}

export default Status