node {
   stage 'Submit Task'
   sh '''
        ANSIBLE_URL="http://ANSIBLE_HOST/playbooks/executions"

        if [ "''' + ANSIBLE_INVENTORY + '''" == "" ]; then
          echo Argument 1 missing: inventory
          exit 1
        fi

        if [ "''' + ANSIBLE_PLAYBOOK + '''" == "" ]; then
          echo Argument 2 missing: playbook
          exit 1
        fi

        RESPONSE=$(curl -X POST \\
            ${ANSIBLE_URL} \\
            -H 'Cache-Control: no-cache' \\
            -H 'Content-Type: application/json' \\
            -d '{
              "playbook": "''' + ANSIBLE_PLAYBOOK + '''",
              "inventory": "''' + ANSIBLE_INVENTORY + '''",
              "parameters": "''' + ANSIBLE_PARAMETERS + '''"
            }')
        ANSIBLE_TASK_ID=$(echo ${RESPONSE} | cut -d\\" -f4)
        echo "Task ${ANSIBLE_TASK_ID} started"

        while true; do

          RESPONSE=$(curl -X GET \\
              ${ANSIBLE_URL}/${ANSIBLE_TASK_ID} \\
              -H 'Cache-Control: no-cache' \\
              -H 'Content-Type: application/json')

          IS_COMPLETED=$(echo ${RESPONSE} | grep "\\"completed\\":true" || echo "false")
          if [ "${IS_COMPLETED}" != "false" ]; then
            echo "Task ${ANSIBLE_TASK_ID} completed"
            exit 0
          fi
          sleep 10

        done
   '''
}
