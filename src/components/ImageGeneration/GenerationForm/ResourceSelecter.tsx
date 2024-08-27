import React, { useState, useEffect } from 'react';
import { Button, Accordion } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';
import { ModelPop } from './ModelPop';
export function ResourceSelecter({ defaultv = [], onSelect, clearC = 0 }: any) {
  const [opened, setOpened] = useState(false);
  const [list, setList] = useState<any[]>(defaultv);
  const onSubmit = (v: any) => {
    const _v = list.concat(v);
    setList(_v);
    setOpened(false);
    onSelect(_v.map((item) => item.versionId));
  };
  useEffect(() => {
    if (clearC > 0) {
      setList([]);
    }
  }, [clearC]);
  const onDel = (id: any) => {
    const _v = list.filter((v) => v.versionId != id);
    setList(_v);
    onSelect(_v.map((item) => item.versionId));
  };
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Accordion
        defaultValue="customization"
        style={{
          border: '1px solid #373A40',
          borderBottomWidth: '0',
          borderRadius: '6px',
          backgroundColor: 'rgba(43, 45, 48, 0.50)',
          overflow: 'hidden',
        }}
      >
        <Accordion.Item value="customization">
          <Accordion.Control
            style={{
              color: '#fff',
              fontSize: '14px',
            }}
          >
            Additional Resources
          </Accordion.Control>
          <Accordion.Panel>
            {list.length ? (
              <div
                style={{
                  color: '#fff',
                  margin: '14px 0 10px 0',
                }}
              >
                Embedding
              </div>
            ) : (
              ''
            )}

            <div className="list">
              {list.length
                ? list.map((info) => (
                    <div
                      key={info.versionId}
                      className="item"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        className="model_name"
                        style={{
                          color: '#9B9C9E',
                          fontSize: '12px',
                        }}
                      >
                        {info.name}
                      </div>
                      <IconX
                        size={18}
                        style={{
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                        onClick={() => onDel(info.versionId)}
                      />
                    </div>
                  ))
                : ''}
            </div>
            <Button
              onClick={() => setOpened(true)}
              style={{
                width: '100%',
                marginTop: '16px',
                backgroundColor: 'rgba(43, 45, 48, 0.50)',
                color: '#fff',
                border: '1px solid #2B2D30',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            >
              <IconPlus
                size={18}
                style={{
                  marginRight: '6px',
                  fontWeight: 'bolder',
                }}
              />
              Add additional esources
            </Button>
          </Accordion.Panel>
        </Accordion.Item>

        <ModelPop
          type="resource"
          opened={opened}
          onSubmit={onSubmit}
          versionId={list.length ? list.map((v) => v.versionId) : []}
          onClose={() => setOpened(false)}
        />
      </Accordion>
    </div>
  );
}
