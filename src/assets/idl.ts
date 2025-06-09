export type UsdvBridge = {
    "version": "0.1.0",
    "name": "usdv_bridge",
    "instructions": [
        {
            "name": "initialize",
            "docs": [
                "This instruction initializes the program config, which is meant",
                "to store data useful for other instructions. The config specifies",
                "an owner (e.g. multisig) and should be read-only for every instruction",
                "in this example. This owner will be checked for designated owner-only",
                "instructions like [`register_emitter`](register_emitter).",
                "",
                "# Arguments",
                "",
                "* `ctx` - `Initialize` context"
            ],
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Whoever initializes the config will be the owner of the program. Signer",
                        "for creating the [`Config`] account and posting a Wormhole message",
                        "indicating that the program is alive."
                    ]
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Config account, which saves program data useful for other instructions.",
                        "Also saves the payer of the [`initialize`](crate::initialize) instruction",
                        "as the program's owner."
                    ]
                },
                {
                    "name": "wormholeProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Wormhole program."
                    ]
                },
                {
                    "name": "wormholeBridge",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Wormhole bridge data account (a.k.a. its config).",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "wormholeFeeCollector",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Wormhole fee collector account, which requires lamports before the",
                        "program can post a message (if there is a fee).",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "wormholeEmitter",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "This program's emitter account. We create this account in the",
                        "[`initialize`](crate::initialize) instruction, but",
                        "[`wormhole::post_message`] only needs it to be read-only."
                    ]
                },
                {
                    "name": "wormholeSequence",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "message is posted, so it needs to be an [UncheckedAccount] for the",
                        "[`initialize`](crate::initialize) instruction.",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "wormholeMessage",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "account, which requires this program's signature.",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "clock",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Clock sysvar."
                    ]
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Rent sysvar."
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "System program."
                    ]
                }
            ],
            "args": []
        },
        {
            "name": "registerEmitter",
            "docs": [
                "This instruction registers a new foreign emitter (from another network)",
                "and saves the emitter information in a ForeignEmitter account. This",
                "instruction is owner-only, meaning that only the owner of the program",
                "(defined in the [Config] account) can add and update emitters.",
                "",
                "# Arguments",
                "",
                "* `ctx`     - `RegisterForeignEmitter` context",
                "* `chain`   - Wormhole Chain ID",
                "* `address` - Wormhole Emitter Address"
            ],
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Owner of the program set in the [`Config`] account. Signer for creating",
                        "the [`ForeignEmitter`] account."
                    ]
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Config account. This program requires that the `owner` specified in the",
                        "context equals the pubkey specified in this account. Read-only."
                    ]
                },
                {
                    "name": "foreignEmitter",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Foreign Emitter account. Create this account if an emitter has not been",
                        "registered yet for this Wormhole chain ID. If there already is an",
                        "emitter address saved in this account, overwrite it."
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "System program."
                    ]
                }
            ],
            "args": [
                {
                    "name": "chain",
                    "type": "u16"
                },
                {
                    "name": "address",
                    "type": {
                        "array": [
                            "u8",
                            32
                        ]
                    }
                }
            ]
        },
        {
            "name": "burnAndSend",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Payer will pay Wormhole fee to post a message."
                    ]
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeBridge",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wormholeFeeCollector",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wormholeEmitter",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeSequence",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wormholeMessage",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "account be mutable."
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "clock",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "receiveAndMint",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "User who receives the minted tokens"
                    ]
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Pays for account initialization"
                    ]
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "posted",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "foreignEmitter",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "received",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mintAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "vaaHash",
                    "type": {
                        "array": [
                            "u8",
                            32
                        ]
                    }
                }
            ]
        },
        {
            "name": "setPublicMint",
            "accounts": [
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "isMintable",
                    "type": "bool"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "config",
            "docs": [
                "Config account data."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "docs": [
                            "Program's owner."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "wormhole",
                        "docs": [
                            "Wormhole program's relevant addresses."
                        ],
                        "type": {
                            "defined": "WormholeAddresses"
                        }
                    },
                    {
                        "name": "batchId",
                        "docs": [
                            "AKA nonce. Just zero, but saving this information in this account",
                            "anyway."
                        ],
                        "type": "u32"
                    },
                    {
                        "name": "finality",
                        "docs": [
                            "AKA consistency level. u8 representation of Solana's",
                            "[Finality](wormhole_anchor_sdk::wormhole::Finality)."
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "isPublicMint",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "foreignEmitter",
            "docs": [
                "Foreign emitter account data."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "chain",
                        "docs": [
                            "Emitter chain. Cannot equal `1` (Solana's Chain ID)."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "address",
                        "docs": [
                            "Emitter address. Cannot be zero address."
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "received",
            "docs": [
                "Received account."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "batchId",
                        "docs": [
                            "AKA nonce. Should always be zero in this example, but we save it anyway."
                        ],
                        "type": "u32"
                    },
                    {
                        "name": "wormholeMessageHash",
                        "docs": [
                            "Keccak256 hash of verified Wormhole message."
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        "name": "message",
                        "docs": [
                            "WormholeMessage from [WormholeMessage::Hello](crate::message::WormholeMessage)."
                        ],
                        "type": "bytes"
                    }
                ]
            }
        },
        {
            "name": "wormholeEmitter",
            "docs": [
                "Wormhole emitter account."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "docs": [
                            "PDA bump."
                        ],
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "WormholeAddresses",
            "docs": [
                "Wormhole program related addresses."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bridge",
                        "docs": [
                            "[BridgeData](wormhole_anchor_sdk::wormhole::BridgeData) address."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "feeCollector",
                        "docs": [
                            "[FeeCollector](wormhole_anchor_sdk::wormhole::FeeCollector) address."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "sequence",
                        "docs": [
                            "[SequenceTracker](wormhole_anchor_sdk::wormhole::SequenceTracker) address."
                        ],
                        "type": "publicKey"
                    }
                ]
            }
        },
        {
            "name": "WormholeMessage",
            "docs": [
                "Expected message types for this program. Only valid payloads are:",
                "* `Alive`: Payload ID == 0. Emitted when [`initialize`](crate::initialize)",
                "is called).",
                "* `Hello`: Payload ID == 1. Emitted when",
                "[`send_message`](crate::send_message) is called).",
                "",
                "Payload IDs are encoded as u8."
            ],
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Alive",
                        "fields": [
                            {
                                "name": "programId",
                                "type": "publicKey"
                            }
                        ]
                    },
                    {
                        "name": "Hello",
                        "fields": [
                            {
                                "name": "message",
                                "type": "bytes"
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "Unauthorized",
            "msg": "Unauthorized minting attempt."
        },
        {
            "code": 6001,
            "name": "InvalidMintDecimals",
            "msg": "Mint has invalid decimals."
        },
        {
            "code": 6002,
            "name": "OwnerOnly",
            "msg": "OwnerOnly"
        },
        {
            "code": 6003,
            "name": "InvalidForeignEmitter",
            "msg": "InvalidForeignEmitter"
        },
        {
            "code": 6004,
            "name": "InvalidWormholeConfig",
            "msg": "InvalidWormholeConfig"
        },
        {
            "code": 6005,
            "name": "InvalidWormholeFeeCollector",
            "msg": "InvalidWormholeFeeCollector"
        },
        {
            "code": 6006,
            "name": "InvalidWormholeSequence",
            "msg": "InvalidWormholeSequence"
        },
        {
            "code": 6007,
            "name": "InvalidMessage",
            "msg": "InvalidMessage"
        },
        {
            "code": 6008,
            "name": "PublicMintDisabled",
            "msg": "Public mint is disabled."
        }
    ]
};

export const IDL: UsdvBridge = {
    "version": "0.1.0",
    "name": "usdv_bridge",
    "instructions": [
        {
            "name": "initialize",
            "docs": [
                "This instruction initializes the program config, which is meant",
                "to store data useful for other instructions. The config specifies",
                "an owner (e.g. multisig) and should be read-only for every instruction",
                "in this example. This owner will be checked for designated owner-only",
                "instructions like [`register_emitter`](register_emitter).",
                "",
                "# Arguments",
                "",
                "* `ctx` - `Initialize` context"
            ],
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Whoever initializes the config will be the owner of the program. Signer",
                        "for creating the [`Config`] account and posting a Wormhole message",
                        "indicating that the program is alive."
                    ]
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Config account, which saves program data useful for other instructions.",
                        "Also saves the payer of the [`initialize`](crate::initialize) instruction",
                        "as the program's owner."
                    ]
                },
                {
                    "name": "wormholeProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Wormhole program."
                    ]
                },
                {
                    "name": "wormholeBridge",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Wormhole bridge data account (a.k.a. its config).",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "wormholeFeeCollector",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Wormhole fee collector account, which requires lamports before the",
                        "program can post a message (if there is a fee).",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "wormholeEmitter",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "This program's emitter account. We create this account in the",
                        "[`initialize`](crate::initialize) instruction, but",
                        "[`wormhole::post_message`] only needs it to be read-only."
                    ]
                },
                {
                    "name": "wormholeSequence",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "message is posted, so it needs to be an [UncheckedAccount] for the",
                        "[`initialize`](crate::initialize) instruction.",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "wormholeMessage",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "account, which requires this program's signature.",
                        "[`wormhole::post_message`] requires this account be mutable."
                    ]
                },
                {
                    "name": "clock",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Clock sysvar."
                    ]
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Rent sysvar."
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "System program."
                    ]
                }
            ],
            "args": []
        },
        {
            "name": "registerEmitter",
            "docs": [
                "This instruction registers a new foreign emitter (from another network)",
                "and saves the emitter information in a ForeignEmitter account. This",
                "instruction is owner-only, meaning that only the owner of the program",
                "(defined in the [Config] account) can add and update emitters.",
                "",
                "# Arguments",
                "",
                "* `ctx`     - `RegisterForeignEmitter` context",
                "* `chain`   - Wormhole Chain ID",
                "* `address` - Wormhole Emitter Address"
            ],
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Owner of the program set in the [`Config`] account. Signer for creating",
                        "the [`ForeignEmitter`] account."
                    ]
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "Config account. This program requires that the `owner` specified in the",
                        "context equals the pubkey specified in this account. Read-only."
                    ]
                },
                {
                    "name": "foreignEmitter",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "Foreign Emitter account. Create this account if an emitter has not been",
                        "registered yet for this Wormhole chain ID. If there already is an",
                        "emitter address saved in this account, overwrite it."
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "System program."
                    ]
                }
            ],
            "args": [
                {
                    "name": "chain",
                    "type": "u16"
                },
                {
                    "name": "address",
                    "type": {
                        "array": [
                            "u8",
                            32
                        ]
                    }
                }
            ]
        },
        {
            "name": "burnAndSend",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Payer will pay Wormhole fee to post a message."
                    ]
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeBridge",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wormholeFeeCollector",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wormholeEmitter",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeSequence",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wormholeMessage",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "account be mutable."
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "clock",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "receiveAndMint",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "User who receives the minted tokens"
                    ]
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true,
                    "docs": [
                        "Pays for account initialization"
                    ]
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wormholeProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "posted",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "foreignEmitter",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "received",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mintAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "vaaHash",
                    "type": {
                        "array": [
                            "u8",
                            32
                        ]
                    }
                }
            ]
        },
        {
            "name": "setPublicMint",
            "accounts": [
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "isMintable",
                    "type": "bool"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "config",
            "docs": [
                "Config account data."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "docs": [
                            "Program's owner."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "wormhole",
                        "docs": [
                            "Wormhole program's relevant addresses."
                        ],
                        "type": {
                            "defined": "WormholeAddresses"
                        }
                    },
                    {
                        "name": "batchId",
                        "docs": [
                            "AKA nonce. Just zero, but saving this information in this account",
                            "anyway."
                        ],
                        "type": "u32"
                    },
                    {
                        "name": "finality",
                        "docs": [
                            "AKA consistency level. u8 representation of Solana's",
                            "[Finality](wormhole_anchor_sdk::wormhole::Finality)."
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "isPublicMint",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "foreignEmitter",
            "docs": [
                "Foreign emitter account data."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "chain",
                        "docs": [
                            "Emitter chain. Cannot equal `1` (Solana's Chain ID)."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "address",
                        "docs": [
                            "Emitter address. Cannot be zero address."
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "received",
            "docs": [
                "Received account."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "batchId",
                        "docs": [
                            "AKA nonce. Should always be zero in this example, but we save it anyway."
                        ],
                        "type": "u32"
                    },
                    {
                        "name": "wormholeMessageHash",
                        "docs": [
                            "Keccak256 hash of verified Wormhole message."
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        "name": "message",
                        "docs": [
                            "WormholeMessage from [WormholeMessage::Hello](crate::message::WormholeMessage)."
                        ],
                        "type": "bytes"
                    }
                ]
            }
        },
        {
            "name": "wormholeEmitter",
            "docs": [
                "Wormhole emitter account."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "docs": [
                            "PDA bump."
                        ],
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "WormholeAddresses",
            "docs": [
                "Wormhole program related addresses."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bridge",
                        "docs": [
                            "[BridgeData](wormhole_anchor_sdk::wormhole::BridgeData) address."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "feeCollector",
                        "docs": [
                            "[FeeCollector](wormhole_anchor_sdk::wormhole::FeeCollector) address."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "sequence",
                        "docs": [
                            "[SequenceTracker](wormhole_anchor_sdk::wormhole::SequenceTracker) address."
                        ],
                        "type": "publicKey"
                    }
                ]
            }
        },
        {
            "name": "WormholeMessage",
            "docs": [
                "Expected message types for this program. Only valid payloads are:",
                "* `Alive`: Payload ID == 0. Emitted when [`initialize`](crate::initialize)",
                "is called).",
                "* `Hello`: Payload ID == 1. Emitted when",
                "[`send_message`](crate::send_message) is called).",
                "",
                "Payload IDs are encoded as u8."
            ],
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Alive",
                        "fields": [
                            {
                                "name": "programId",
                                "type": "publicKey"
                            }
                        ]
                    },
                    {
                        "name": "Hello",
                        "fields": [
                            {
                                "name": "message",
                                "type": "bytes"
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "Unauthorized",
            "msg": "Unauthorized minting attempt."
        },
        {
            "code": 6001,
            "name": "InvalidMintDecimals",
            "msg": "Mint has invalid decimals."
        },
        {
            "code": 6002,
            "name": "OwnerOnly",
            "msg": "OwnerOnly"
        },
        {
            "code": 6003,
            "name": "InvalidForeignEmitter",
            "msg": "InvalidForeignEmitter"
        },
        {
            "code": 6004,
            "name": "InvalidWormholeConfig",
            "msg": "InvalidWormholeConfig"
        },
        {
            "code": 6005,
            "name": "InvalidWormholeFeeCollector",
            "msg": "InvalidWormholeFeeCollector"
        },
        {
            "code": 6006,
            "name": "InvalidWormholeSequence",
            "msg": "InvalidWormholeSequence"
        },
        {
            "code": 6007,
            "name": "InvalidMessage",
            "msg": "InvalidMessage"
        },
        {
            "code": 6008,
            "name": "PublicMintDisabled",
            "msg": "Public mint is disabled."
        }
    ]
};
